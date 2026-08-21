import { useState } from "react";

import { useInterval, pickCrop, cappedWidth, ASPECT_CLASS, RATIOS } from "lib";
import ImageWrapper from "./ImageWrapper";

// How long each frame holds before the next one cuts in.
export const CYCLE_MS = 900;

// A handful of frames reads as a preview; anything past that is a reason to
// visit the project, and a lot of bytes for a hover.
const MAX_FRAMES = 8;

const canAnimate = () =>
  typeof window.matchMedia !== "function" ||
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Touch taps raise a mouseenter, and a cycle nobody asked for is worse on a
// phone than no cycle at all.
const canHover = () =>
  typeof window.matchMedia !== "function" ||
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * A stack of images that cuts from one to the next — the project cards' hover
 * preview and the website carousels are the same thing with a different
 * trigger, so they are the same component.
 *
 * Frames stack in source order and each one is opaque, so a frame that hasn't
 * finished decoding shows the frame beneath rather than a gap — which is what
 * keeps a cut, with no fade to cover it, from flashing. Frames mount one ahead
 * of where the cycle has reached, so a hover fetches at the pace it is watched
 * rather than all at once, and everything reached stays mounted: leaving and
 * returning to a card is instant.
 *
 * `frames` are Prismic image fields; each is cropped to `ratio`, so every frame
 * fills the same box.
 */
export default function FrameCycle({
  frames = [],
  ratio,
  sizes,
  alt = "",
  interval = CYCLE_MS,
  trigger = "hover",
  cap = true,
  className = "",
}) {
  const images = frames.filter((frame) => frame?.url).slice(0, MAX_FRAMES);

  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);
  const [reach, setReach] = useState(0);

  useInterval(
    () => {
      const next = (index + 1) % images.length;
      setIndex(next);
      setReach((current) =>
        Math.max(current, Math.min(next + 1, images.length - 1)),
      );
    },
    cycling ? interval : null,
  );

  const start = () => {
    if (images.length < 2 || !canAnimate()) return;
    // The next frame mounts on start rather than on the first tick, so it has a
    // full interval to load before it is shown.
    setReach((current) => Math.max(current, 1));
    setCycling(true);
  };

  const stop = () => {
    setCycling(false);
    setIndex(0);
  };

  const hover = trigger === "hover";

  const box = [
    "relative mx-auto",
    ASPECT_CLASS[ratio] ?? "",
    hover ? "group" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!images.length) return null;

  // Frames are absolutely positioned, so the box has to carry the height. A
  // named ratio supplies it as a class; an uncropped image ("main") has only
  // its own dimensions to go on, and every frame is then held to the shape of
  // the first.
  const first = pickCrop(images[0], ratio);
  const shape =
    RATIOS[ratio] ??
    (first?.dimensions?.height
      ? first.dimensions.width / first.dimensions.height
      : undefined);

  const style = {
    aspectRatio: ASPECT_CLASS[ratio] || !shape ? undefined : String(shape),
    maxWidth: cap ? cappedWidth(shape) : undefined,
  };

  return (
    <div
      className={box}
      style={style}
      onMouseEnter={hover ? () => canHover() && start() : undefined}
      onMouseLeave={hover ? stop : undefined}
    >
      <ImageWrapper
        image={images[0]}
        ratio={ratio}
        sizes={sizes}
        alt={alt}
        fill
        // Auto-play starts once the first frame has actually landed. Frames
        // are lazy by default, so that is also the point at which the
        // carousel is near enough the viewport to be worth cycling.
        onLoad={trigger === "auto" ? start : undefined}
      />
      {images.slice(1, reach + 1).map((frame, offset) => (
        <ImageWrapper
          key={pickCrop(frame, ratio)?.url ?? offset}
          image={frame}
          ratio={ratio}
          sizes={sizes}
          fill
          // The cut is the effect; a frame arriving out of a reveal, or over a
          // grey box rather than the frame beneath, would undo it.
          reveal={false}
          placeholder={false}
          className={offset + 1 <= index ? "opacity-100" : "opacity-0"}
          // Decorative: the first frame above already names the picture.
          alt=""
        />
      ))}
    </div>
  );
}
