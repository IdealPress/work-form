import React from "react";
import { PrismicRichText } from "@prismicio/react";

const DetailBlock = ({ slice }) => (
  <section className="mx-8 lg:w-3/5 columns-2 space-y-2">
      <div className="prose">
        {slice.items.map((item, index) => (
          <div key={index} className="prose-sm break-inside-avoid-column">
            <p className="">{item.title}</p>
            {item.text && <PrismicRichText field={item.text} className="break-inside-avoid-column"/>}
          </div>
        ))}
    </div>
  </section>
);

export default DetailBlock;
