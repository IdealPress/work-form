import React from "react";
import { PrismicRichText } from "@prismicio/react";

const TextBlock = ({ slice }) => (
  <section className="px-6 md:px-8 lg:w-3/5">
    <div className="prose-xl max-w-[65ch] leading-7 sm:leading-[unset] ">
      {slice.primary.text && <PrismicRichText field={slice.primary.text} />}
    </div>
  </section>
);

export default TextBlock;
