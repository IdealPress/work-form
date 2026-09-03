import React from "react";
import {
  SizeWrapper,
  LinkWrapper,
  ImageWrapper,
  TopRightArrow,
} from "components";
import { imageCap, isNarrow, rowSizes } from "lib";

const Project = ({ slice }) => {
  const projectLinkConstructor = (project) => {
    return project.uid && `/projects/${project.uid}`;
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-gutter px-gutter">
      {slice.items.map((item, index) => (
        <div className="w-full min-w-0" key={index}>
          <SizeWrapper size={item.size}>
            <figure
              className="image-figure"
              style={
                isNarrow(item.size)
                  ? { maxWidth: imageCap(item.image, item.ratio) }
                  : undefined
              }
            >
              {/* The link wraps the image alone so both the hover state and the
                  click target stop at the image edge, rather than filling the
                  surrounding column. */}
              <LinkWrapper
                url={
                  item.link?.url
                    ? item.link?.url
                    : projectLinkConstructor(item.project)
                }
                target={item.link?.url && "_blank"}
                className="peer block w-fit"
              >
                <ImageWrapper
                  item={item}
                  sizes={rowSizes(slice.items.length, item.size)}
                />
              </LinkWrapper>
              <figcaption className="md:peer-hover:opacity-100 md:peer-focus:opacity-100 md:opacity-0 transition-opacity leading-tight text-base md:text-lg pt-2">
                {item.caption && (
                  <p className="leading-snug text-base md:text-lg space-x-2 text-grey">
                    <span>{item.caption}</span>
                    {item.link?.url && (
                      <span className="inline-block">
                        <TopRightArrow className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      </span>
                    )}
                  </p>
                )}
              </figcaption>
            </figure>
          </SizeWrapper>
        </div>
      ))}
    </section>
  );
};

export default Project;
