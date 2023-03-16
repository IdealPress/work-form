import React from 'react'
import NextImage from "next/image"
import { SizeWrapper, LinkWrapper, ImageWrapper, TopRightArrow } from 'components'
import { useRandomColor } from 'lib'


const Project = ({ slice, context }) => {

  const projectLinkConstructor = (project) => {
    return project.uid && `/projects/${project.uid}`
  }

  return (
    <section className="space-y-28 md:space-y-0 md:flex items-center justify-center px-6 md:px-8">
      {slice.items.map((item, index) => (
        <div className="w-full" key={index}>
          <LinkWrapper 
            url={item.link?.url ? item.link?.url : projectLinkConstructor(item.project)}
            target={item.link?.url && "_blank"}
          >
            <SizeWrapper size={item.size}>
              <figure>
                <ImageWrapper item={item} /> 
                <figcaption 
                  className={`${item.link?.url && 'text-gray-400'} mt-2 leading-tight text-base md:text-lg`}
                >
                  {item.show_caption && (
                    <>
                      {item.caption ? (
                        <p className="leading-snug text-base md:text-lg space-x-2">
                          <span>{item.caption}</span>
                          {item.link?.url && (
                            <span className="inline-block">
                              <TopRightArrow className="w-2.5 h-2.5 md:w-3 md:h-3"/>
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="leading-snug text-base md:text-lg group-focus:text-gray-400 group-hover:text-gray-400">
                            {item.project?.data?.title}
                            {item.project?.tags?.map((tag, index) => (
                                <span className="ml-3 text-gray-400" key={index}>{tag}</span>
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
  )
}

export default Project;