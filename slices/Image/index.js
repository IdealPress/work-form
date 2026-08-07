import React from "react";
import { SizeWrapper, LinkWrapper, ImageWrapper } from "components";

const Image = ({ slice, context }) => {
  return (
    <section className="md:flex items-center justify-center px-6 space-y-24 md:space-y-0">
      {slice.items.map((item, index) => (
        <div className="w-full" key={index}>
          <LinkWrapper url={item.link?.url}>
            <SizeWrapper size={item.size}>
              <figure>
                <ImageWrapper item={item} />
                <figcaption className="leading-tight text-base md:text-lg">
                  {item.show_caption && (
                    <>
                      {item.caption ? (
                        <p className="text-grey ">{item.caption}</p>
                      ) : (
                        <p className="group-focus:text-grey group-hover:text-grey">
                          {context.data.title}
                          {context.tags.map((tag, index) => (
                            <span className="ml-2 text-grey" key={index}>
                              {tag}
                            </span>
                          ))}
                        </p>
                      )}
                    </>
                  )}
                </figcaption>
              </figure>
            </SizeWrapper>
          </LinkWrapper>
        </div>
      ))}
    </section>
  );
};

export default Image;
