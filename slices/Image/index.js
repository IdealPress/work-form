import React from "react";
import { SizeWrapper, LinkWrapper, ImageWrapper, FrameCycle } from "components";
import { imageCap, isNarrow, rowSizes } from "lib";

/*
 * The caption a plain image and a carousel both sit under, so the two paths
 * can't drift apart. It falls back to the document's own title and tags when
 * the editor hasn't written one.
 */
const Caption = ({ item, context }) => (
  <figcaption className="leading-tight text-base md:text-lg pt-2">
    {item.show_caption && (
      <>
        {item.caption ? (
          <p className="text-grey">{item.caption}</p>
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
);

const Image = ({ slice, context }) => {
  const carousel = slice.primary.carousel && slice.items.length > 1;

  /*
   * Two ways to move a carousel on. Left alone it plays itself once it is
   * scrolled to; "Progress on hover" hands that to the reader instead, for the
   * sets where the point is comparing one frame against the next rather than
   * watching them go by. Hover is a pointer's move, so on a touch screen such a
   * carousel simply holds on its first frame — which is the same first frame
   * the editor chose to lead with.
   */
  const trigger = slice.primary.carousel_hover ? "hover" : "auto";

  /*
   * A carousel is one image's worth of furniture with the rest of the items
   * cycling inside it, so it renders from the first item alone: that item's
   * ratio, size, caption and link stand for the whole thing, and the editor
   * doesn't have to fill in a second set of fields that only the carousel uses.
   */
  const items = carousel ? slice.items.slice(0, 1) : slice.items;

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-gutter px-gutter">
      {items.map((item, index) => (
        <div className="w-full min-w-0" key={index}>
          <LinkWrapper url={item.link?.url}>
            <SizeWrapper size={item.size}>
              <figure
                className="image-figure"
                style={
                  isNarrow(item.size)
                    ? { maxWidth: imageCap(item.image, item.ratio) }
                    : undefined
                }
              >
                {carousel ? (
                  <FrameCycle
                    frames={slice.items.map((frame) => frame.image)}
                    ratio={item.ratio}
                    sizes={rowSizes(1, item.size)}
                    alt={item.image?.alt ?? ""}
                    shadow={item.shadow}
                    trigger={trigger}
                    // A carousel keeps its place when the pointer leaves or it
                    // scrolls away; only a grid card starts its preview over.
                    resetOnStop={false}
                    cap={false}
                  />
                ) : (
                  <ImageWrapper
                    item={item}
                    sizes={rowSizes(slice.items.length, item.size)}
                  />
                )}
                <Caption item={item} context={context} />
              </figure>
            </SizeWrapper>
          </LinkWrapper>
        </div>
      ))}
    </section>
  );
};

export default Image;
