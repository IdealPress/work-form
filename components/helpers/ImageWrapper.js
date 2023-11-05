import Image from "next/image"
import { useState } from "react";

import { useRandomColor } from "lib";

export default function ImageWrapper({ item }) {

  const [hasLoaded, setHasLoaded] = useState(false)

  return item.ratio !== "main" ? (
    <Image
      className={hasLoaded ? undefined : 'bg-gray-200'}
      src={item.image[item.ratio]?.url}
      width={item.image[item.ratio]?.dimensions.width}
      height={item.image[item.ratio]?.dimensions.height}
      alt={item.image?.alt}
      onLoadingComplete={() => setHasLoaded(true)}
    />
  ) : (
    <Image
      className={hasLoaded ? undefined : 'bg-gray-200'}
      src={item.image?.url}
      width={item.image?.dimensions.width}
      height={item.image?.dimensions.height}
      alt={item.image?.alt}
      onLoadingComplete={() => setHasLoaded(true)}
    />
  )
}
  