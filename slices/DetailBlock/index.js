import React from "react";
import { PrismicRichText } from "@prismicio/react";

const DetailBlock = ({ slice }) => (
  <section className="mx-6 md:mx-8 lg:w-3/5 space-y-2">
    <div className="prose prose-xl leading-7 sm:leading-[unset]">
      {slice.items.map((item, index) => (
        <div key={index}>
          <p className="mt-8 -mb-2">{item.title}</p>
          {item.text && <PrismicRichText field={item.text} className=""/>}
        </div>
      ))}
    </div>
  </section>
);

export default DetailBlock;
