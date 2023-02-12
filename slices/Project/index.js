import React from 'react'
import NextImage from "next/image"
import { SizeWrapper, LinkWrapper, ImageWrapper } from 'components'
import { useRandomColor } from 'lib'


const Project = ({ slice, context }) => {

  const projectLinkConstructor = (project) => {
    return project.slug && `/projects/${project.slug}`
  }

  return (
    <section className="space-y-20 md:space-y-0 md:flex items-center justify-center px-8">
      {slice.items.map((item, index) => (
        <div className="w-full" key={index}>
          <LinkWrapper 
            url={item.link?.url ? item.link?.url : projectLinkConstructor(item.project)}
          >
            <SizeWrapper size={item.size}>
              <figure>
                <ImageWrapper item={item} /> 
                <figcaption>
                  {item.show_caption && (
                    <>
                      {item.caption ? (
                        <p className="leading-snug text-base md:text-lg">
                          {item.caption}
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