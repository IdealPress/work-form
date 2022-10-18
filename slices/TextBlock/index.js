import React from "react";
import { PrismicRichText } from "@prismicio/react";

const TextBlock = ({ slice }) => (
  <section className="mx-8 w-2/3">
    <div className="prose">
      {slice.primary.text && <PrismicRichText field={slice.primary.text} />}
    </div>
  </section>
);

export default TextBlock;
