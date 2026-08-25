import { useState } from "react";

import {
  useInterval,
  useInView,
  pickCrop,
  cappedWidth,
  ASPECT_CLASS,
  RATIOS,
} from "lib";
import ImageWrapper from "./ImageWrapper";

// How long each frame holds before the next one cuts in.
export const CYCLE_MS = 1000;

// What the first frame gains on the rest of them, so its loading line has the
// room to travel the width of the picture and finish there. Long enough to read
// as a line crossing rather than a flicker, short enough that the frame the
// editor chose to open on is still the one being looked at.
export const LEAD_MS = 150;

// A handful of frames reads as a preview; anything past that is a reason to
// visit the project, and a lot of bytes for a hover.
const MAX_FRAMES = 8;

// Asked on every render now that the cycle is derived rather than switched on,
// so it also has to survive the server, where there is no one to ask and
// nothing moving to ask about.
const canAnimate = () =>
  typeof window === "undefined" ||
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
 * `trigger` is what moves the cycle on: "hover" runs it while a pointer is over
 * the box, "auto" while the box is in view. Both are conditions rather than
 * events — a carousel scrolled past stops where it is and carries on from that
 * frame when it comes back, because frames spent off screen are frames nobody
 * sees.
 *
 * `resetOnStop` is the difference between the two things a stopped hover can
 * mean. A grid card is a pitch for a project and starts it over each time you
 * come back; a carousel is the picture itself, and snapping to the first frame
 * as the pointer leaves would throw away the reader's place in it.
 *
 * `frames` are Prismic image fields; each is cropped to `ratio`, so every frame
 * fills the same box.
 *
 * `onReveal` passes on the lead frame's arrival — the frames behind it have no
 * reveal of their own to report — so a caption can land with the picture rather
 * than ahead of it.
 */
export default function FrameCycle({
  frames = [],
  ratio,
  sizes,
  alt = "",
  interval = CYCLE_MS,
  trigger = "hover",
  resetOnStop = true,
  cap = true,
  shadow = false,
  className = "",
  onReveal,
}) {
  const images = frames.filter((frame) => frame?.url).slice(0, MAX_FRAMES);

  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [reach, setReach] = useState(0);
  const [landed, setLanded] = useState(false);
  const [led, setLed] = useState(false);

  const hover = trigger === "hover";
  const auto = trigger === "auto";

  const [viewRef, inView] = useInView();

  // Whether the cycle should be running, rather than a flag something has to
  // remember to switch off: a carousel that scrolls away simply stops meeting
  // the condition, and meets it again on the way back.
  //
  // Being in view isn't enough on its own to start an auto cycle: only the lead
  // frame waits on a reveal, so a clock started before it had decoded could cut
  // to the second picture over the placeholder and leave the first one — the one
  // the editor chose to open on — never seen. A hover is a deliberate act and
  // doesn't wait: the reader is already looking at the card.
  const cycling =
    images.length > 1 && canAnimate() && (auto ? inView && landed : hovering);

  // A carousel gives no warning that it is about to move: an auto one starts
  // cutting at a picture the reader is still reading, and a card's hover preview
  // reads as a still image right up until it isn't. So the first frame holds a
  // little longer than the rest and spends that hold drawing a line across the
  // foot of the picture — by the time the line reaches the far edge, the cut it
  // was counting down to happens.
  //
  // Only ever before the first cut. `led` is what the cycle has already moved
  // once, so a carousel looping back round to its first frame doesn't announce
  // itself a second time; a grid card, which starts its preview over each time
  // you come back to it, clears it on the way out and leads in again.
  const leading = cycling && !led;

  useInterval(
    () => {
      setLed(true);
      const next = (index + 1) % images.length;
      setIndex(next);
      setReach((current) =>
        Math.max(current, Math.min(next + 1, images.length - 1)),
      );
    },
    cycling ? (leading ? interval + LEAD_MS : interval) : null,
  );

  // The frame after the current one mounts the moment the cycle starts rather
  // than on the first tick, so it has a full interval to load before it shows.
  const mounted = cycling ? Math.max(reach, 1) : reach;

  // A hover keeps what it reached even after the pointer leaves, so coming back
  // to a card is instant; a carousel glimpsed on the way past the fold has no
  // such promise to keep, and lets the frame go again.
  const enter = () => {
    // Nothing to cycle, or nobody who wants one: don't fetch the next frame for
    // a hover that was never going to move.
    if (images.length < 2 || !canAnimate() || !canHover()) return;
    setHovering(true);
    setReach((current) => Math.max(current, 1));
  };

  const leave = () => {
    setHovering(false);
    if (resetOnStop) {
      setIndex(0);
      setLed(false);
    }
  };

  // The shadow goes on the box rather than on the frames. Frames are stacked
  // absolutely at the same rect, so shadowing each one would lay the current
  // frame's shadow over the first frame's and compound the alpha — a carousel
  // would sit visibly deeper than the still image beside it. The box is exactly
  // the picture's bounds, so one shadow there is the same shadow with none of
  // the doubling.
  const box = [
    "relative mx-auto",
    ASPECT_CLASS[ratio] ?? "",
    shadow ? "image-shadow" : "",
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
      // Only an auto cycle has anything to ask the viewport, and the grid is
      // enough cards at once that an observer each is worth not spending.
      ref={auto ? viewRef : undefined}
      className={box}
      style={style}
      onMouseEnter={hover ? enter : undefined}
      onMouseLeave={hover ? leave : undefined}
    >
      <ImageWrapper
        image={images[0]}
        ratio={ratio}
        sizes={sizes}
        alt={alt}
        fill
        // What releases an auto cycle, along with being in view — see `cycling`.
        onLoad={auto ? () => setLanded(true) : undefined}
        onReveal={onReveal}
      />
      {images.slice(1, mounted + 1).map((frame, offset) => (
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
      {leading && (
        // Last in the box, so it paints over the frames without a z-index. The
        // duration is handed to the CSS rather than restated there: the line and
        // the hold it belongs to are the same length by construction, whatever
        // interval a caller passes.
        <span
          className="frame-lead"
          style={{ "--frame-lead-duration": `${interval + LEAD_MS}ms` }}
        >
          <span className="frame-lead-bar" />
        </span>
      )}
    </div>
  );
}
