import Image from "next/image"
import { useState } from "react";

import { useRandomColor } from "lib";

export default function ImageWrapper({ item }) {

  const [hasLoaded, setHasLoaded] = useState(false)
  const [color, setColor] = useState(useRandomColor())

  return item.ratio !== "main" ? (
    <Image
      className="transition group-hover:blur-sm group-focus:blur-sm"
      src={item.image[item.ratio]?.url}
      width={item.image[item.ratio]?.dimensions.width}
      height={item.image[item.ratio]?.dimensions.height}
      alt={item.image?.alt}
      onLoadingComplete={() => setHasLoaded(true)}
      style={{
        background: hasLoaded ? undefined : color
      }}
    />
  ) : (
    <Image
      className="transition group-hover:blur-sm group-focus:blur-sm"
      src={item.image?.url}
      width={item.image?.dimensions.width}
      height={item.image?.dimensions.height}
      alt={item.image?.alt}
      onLoadingComplete={() => setHasLoaded(true)}
      style={{
        background: hasLoaded ? undefined : color
      }}
    />
  )
}
  