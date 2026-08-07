import React from "react";
import NextImage from "next/image";
import {
  SizeWrapper,
  LinkWrapper,
  ImageWrapper,
  TopRightArrow,
} from "components";
import { useRandomColor } from "lib";

const Project = ({ slice, context }) => {
  const projectLinkConstructor = (project) => {
    return project.uid && `/projects/${project.uid}`;
  };

  return (
    <section className="space-y-36 md:space-y-0 md:flex items-center justify-center px-6">
      {slice.items.map((item, index) => (
        <div className="w-full" key={index}>
          <SizeWrapper size={item.size}>
            <figure>
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
                <ImageWrapper item={item} />
              </LinkWrapper>
              <figcaption className="md:peer-hover:opacity-100 md:peer-focus:opacity-100 md:opacity-0 transition-opacity leading-tight text-base md:text-lg pt-1.5">
                {item.show_caption && (
                  <>
                    {item.caption ? (
                      <p className="leading-snug text-base md:text-lg space-x-2 text-grey">
                        <span>{item.caption}</span>
                        {item.link?.url && (
                          <span className="inline-block">
                            <TopRightArrow className="w-2.5 h-2.5 md:w-3 md:h-3" />
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="leading-snug text-base md:text-lg">
                        {item.project?.data?.title}
                      </p>
                    )}
                  </>
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
