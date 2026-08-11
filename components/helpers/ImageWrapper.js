import Image from "next/image";
import { useState } from "react";

import { useReveal } from "lib";

export default function ImageWrapper({ item }) {
  const [ref, inView, initiallyVisible] = useReveal();
  const [hasLoaded, setHasLoaded] = useState(false);

  // Named crops sit alongside the original under the image field; `main` is the
  // uncropped image itself.
  const source = item.ratio !== "main" ? item.image?.[item.ratio] : item.image;

  // Wait for both, so we never fade in a half-decoded image or an empty box.
  const revealed = inView && hasLoaded;

  return (
    <Image
      ref={ref}
      className={`reveal ${revealed ? "reveal-in" : ""} ${
        initiallyVisible ? "reveal-delayed" : ""
      } ${hasLoaded ? "" : "bg-gray-200"}`}
      src={source?.url}
      width={source?.dimensions.width}
      height={source?.dimensions.height}
      alt={item.image?.alt}
      onLoad={() => setHasLoaded(true)}
    />
  );
}
