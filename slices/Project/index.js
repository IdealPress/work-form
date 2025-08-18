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
    <section className="space-y-36 md:space-y-0 md:flex items-center justify-center px-6 md:px-8">
      {slice.items.map((item, index) => (
        <div className="w-full" key={index}>
          <LinkWrapper
            url={
              item.link?.url
                ? item.link?.url
                : projectLinkConstructor(item.project)
            }
            target={item.link?.url && "_blank"}
          >
            <SizeWrapper size={item.size}>
              <figure className="group">
                <ImageWrapper item={item} />
                <figcaption className="md:group-hover:opacity-100 md:opacity-0 transition-opacity leading-tight text-base md:text-lg pt-1.5">
                  {item.show_caption && (
                    <>
                      {item.caption ? (
                        <p className="leading-snug text-base md:text-lg space-x-2 text-gray-400">
                          <span>{item.caption}</span>
                          {item.link?.url && (
                            <span className="inline-block">
                              <TopRightArrow className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="md:group-hover:opacity-100 md:opacity-0 transition-opacity leading-snug text-base md:text-lg">
                          {item.project?.data?.title}
                          {item.project?.tags?.map((tag, index) => (
                            <span className="ml-3 text-gray-400" key={index}>
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

export default Project;
