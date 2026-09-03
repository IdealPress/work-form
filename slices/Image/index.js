import React from "react";
import { SizeWrapper, MediaWrapper, FrameCycle } from "components";
import { hasVideo, imageCap, isNarrow, rowSizes } from "lib";

/*
 * The caption a plain image and a carousel both sit under, so the two paths
 * can't drift apart. An item with nothing written on it simply has none: the
 * caption fades in under the pointer, so there is no longer a toggle to switch
 * it off with — an empty one is already silent until you go looking for it.
 */
const Caption = ({ item }) => (
  <figcaption className="leading-tight text-base pt-2">
    {item.caption && (
      <p className="text-grey opacity-0 group-hover:opacity-100 transition-opacity">
        {item.caption}
      </p>
    )}
  </figcaption>
);

/**
 * The cells of the row, read off the items rather than off a layout the editor
 * has to name.
 *
 * An item that cycles with the one above it folds into the cell before it as
 * another of that cell's frames; anything else opens a new cell beside it. One
 * tickbox therefore spells out every arrangement — a carousel next to a still,
 * two carousels side by side, a video between them — with no positions to
 * enumerate and nothing to keep in step with the number of items. It reads
 * locally, too: an item only ever refers to the one above, so reordering items
 * in Prismic rearranges the row exactly the way the list looks like it should.
 */
const cells = (items) =>
  items.reduce((row, item) => {
    // The first item has nothing above it to join, whatever it says.
    if (item.cycle && row.length) row[row.length - 1].push(item);
    else row.push([item]);
    return row;
  }, []);

/*
 * The screen-height cap for the figure around a still image, which is held by
 * the crop's own dimensions. A video sizes itself from the ratio it was given
 * and applies the same cap from inside, so the figure leaves it alone rather
 * than capping it twice against a poster that may not even be there.
 */
const figureCap = (lead) =>
  isNarrow(lead.size) && !hasVideo(lead.video)
    ? { maxWidth: imageCap(lead.image, lead.ratio) }
    : undefined;

/**
 * A row of media. Every cell is an image, a video, or a set of either cycling
 * in place — the same frame, the same shape, size and caption — so what a slice
 * holds is decided by what the editor uploaded into it rather than by which
 * slice they reached for.
 *
 * A cell's first item is the one that furnishes it: its ratio, size and caption
 * stand for the whole cell, so the frames cycling behind it don't each ask for
 * a set of fields only the first one is read from.
 */
const Image = ({ slice }) => {
  const row = cells(slice.items);

  /*
   * Left alone a carousel plays itself once it is scrolled to; untick auto-play
   * and it waits for the reader instead, for the sets where the point is
   * comparing one frame against the next rather than watching them go by. Hover
   * is a pointer's move, so on a touch screen such a carousel simply holds on
   * its first frame — which is the same first frame the editor chose to lead
   * with.
   */
  const trigger = slice.primary.autoplay ? "auto" : "hover";

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-gutter px-gutter">
      {row.map((cell, index) => {
        const [lead] = cell;
        const sizes = rowSizes(row.length, lead.size);

        return (
          <div className="w-full min-w-0" key={index}>
            <SizeWrapper size={lead.size}>
              <figure className="image-figure group" style={figureCap(lead)}>
                {cell.length > 1 ? (
                  <FrameCycle
                    // A video frame cycles as its poster: a cell that cycles is
                    // a set of stills being compared, and an item's own image is
                    // already the still that stands for it.
                    frames={cell.map((frame) => frame.image)}
                    ratio={lead.ratio}
                    sizes={sizes}
                    alt={lead.image?.alt ?? ""}
                    shadow={lead.shadow}
                    trigger={trigger}
                    // A carousel keeps its place when the pointer leaves or it
                    // scrolls away; only a grid card starts its preview over.
                    resetOnStop={false}
                    cap={false}
                  />
                ) : (
                  <MediaWrapper item={lead} sizes={sizes} />
                )}
                <Caption item={lead} />
              </figure>
            </SizeWrapper>
          </div>
        );
      })}
    </section>
  );
};

export default Image;
