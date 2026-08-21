import NextImage from "next/image";
import { useState } from "react";

import { useReveal, pickCrop, isAnimated, withoutUpscale } from "lib";
import { revealClass } from "./Reveal";

/**
 * Every image on the site goes through here: it picks the crop, holds a
 * placeholder while the bytes are in flight, and reveals once the image is both
 * on screen and decoded — so nothing ever fades in half-drawn.
 *
 * Takes either a Prismic slice `item` ({ image, ratio }) or an `image` field
 * and `ratio` directly.
 *
 * `fill` stretches the image to a parent that already has a size (a fixed
 * aspect box, a stack of frames); otherwise the crop's own dimensions set the
 * height, which is what keeps the page from reflowing as images land.
 *
 * `placeholder` is for images stacked on top of something — a frame mid-cycle
 * shows the frame beneath while it loads, and grey would only cover it up.
 *
 * Nothing here holds the image to the screen's height: that cap belongs to
 * whatever lays the image out — the figure around it, or the box it fills — so
 * that a caption is narrowed along with the picture it belongs to.
 */
export default function ImageWrapper({
  item,
  image = item?.image,
  ratio = item?.ratio,
  sizes,
  alt,
  className = "",
  fill = false,
  priority = false,
  reveal = true,
  placeholder = true,
  onLoad,
}) {
  const [ref, inView, initiallyVisible] = useReveal();
  const [hasLoaded, setHasLoaded] = useState(false);

  const source = pickCrop(image, ratio);
  if (!source?.url) return null;

  const revealed = !reveal || (inView && hasLoaded);

  // An animation goes to Prismic's CDN as it is: the optimiser can't do
  // anything with it but download it, and a crop the model upscaled would be
  // tens of megabytes of it.
  const animated = isAnimated(source);
  const src = animated ? withoutUpscale(source.url) : source.url;

  const classes = [
    reveal ? revealClass(revealed, initiallyVisible) : "",
    hasLoaded || !placeholder ? "" : "bg-gray-200",
    fill ? "object-cover" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <NextImage
      ref={ref}
      className={classes}
      src={src}
      alt={alt ?? image?.alt ?? ""}
      sizes={sizes}
      priority={priority}
      unoptimized={animated}
      onLoad={(event) => {
        setHasLoaded(true);
        onLoad?.(event);
      }}
      {...(fill
        ? { fill: true }
        : {
            width: source.dimensions?.width,
            height: source.dimensions?.height,
          })}
    />
  );
}
