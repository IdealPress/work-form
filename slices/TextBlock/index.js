import React from "react";
import { RichText } from "components";

const TextBlock = ({ slice }) => (
  <section className="px-6 lg:w-3/5">
    <div className="prose-xl max-w-[65ch] leading-7 sm:leading-[unset] ">
      {slice.primary.text && <RichText field={slice.primary.text} />}
    </div>
  </section>
);

export default TextBlock;
