import React from "react";
import { PrismicRichText } from "@prismicio/react";

const DetailBlock = ({ slice }) => (
  <section className="mx-8 w-2/3 gtcolumns-2 space-y-2">
    <div className="space-y-2">
      <div className="prose">
        {slice.items.map((item, index) => (
          <div key={index} className="prose break-inside-avoid-column">
            <p className="">{item.title}</p>
            {item.text && <PrismicRichText field={item.text} />}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DetailBlock;
