import React from 'react'
import NextImage from "next/image"
import { SizeWrapper, LinkWrapper } from 'components'


const Project = ({ slice, context }) => {

  const projectLinkConstructor = (project) => {
    return project.slug && `/archive/${project.slug}`
  }

  return (
    <section className="flex items-center justify-center px-8">
      {slice.items.map((item, index) => (
        <div className="w-full" key={index}>
          <LinkWrapper url={item.link?.url ? item.link?.url : projectLinkConstructor(item.project)}>
            <SizeWrapper size={item.size}>
              <figure>
                {item.ratio === 'main' ? (
                  <NextImage src={item.image.url} width={item.image.dimensions.width} height={item.image.dimensions.height} />
                ) : (
                  <NextImage src={item.image[item.ratio].url} width={item.image[item.ratio].dimensions.width} height={item.image[item.ratio].dimensions.height} />
                )}
                <figcaption>
                  {item.show_caption && (
                    <>
                      {item.caption ? (
                        <p>{item.caption}</p>
                      ) : (
                        <p className="leading-snug md:text-lg">
                            {item.project?.data?.title}
                            {item.project?.tags?.map((tag, index) => (
                                <span className="ml-2 text-gray-400" key={index}>{tag}</span>
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