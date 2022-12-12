import React from "react";
import { PrismicRichText } from "@prismicio/react";

const TextBlock = ({ slice }) => (
  <section className="mx-8 lg:w-3/5">
    <div className="prose-xl max-w-none">
      {slice.primary.text && <PrismicRichText field={slice.primary.text} />}
    </div>
  </section>
);

export default TextBlock;
