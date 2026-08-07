import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";

import { linkResolver } from "prismicio";

// `PrismicProvider` was removed in @prismicio/react v3, so the link resolver and
// the internal link component are passed per render instead of via context.
export default function RichText(props) {
  return (
    <PrismicRichText
      linkResolver={linkResolver}
      internalLinkComponent={Link}
      {...props}
    />
  );
}
