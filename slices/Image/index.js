import React from 'react'
import { SizeWrapper, LinkWrapper, ImageWrapper } from 'components'

const Image = ({ slice, context }) => {
  return (
    <section className="md:flex items-center justify-center px-6 md:px-8 space-y-24 md:space-y-0">
      {slice.items.map((item, index) => (
        <div className="w-full" key={index}>
          <LinkWrapper url={item.link?.url}>
            <SizeWrapper size={item.size}>
              <figure>
                <ImageWrapper item={item} /> 
                <figcaption className="mt-2 leading-tight text-base md:text-lg">
                  {item.show_caption && (
                    <>
                      {item.caption ? (
                        <p className="text-gray-400 ">
                          {item.caption}
                        </p>
                      ) : (
                        <p className="group-focus:text-gray-400 group-hover:text-gray-400">
                          {context.data.title}
                          {context.tags.map((tag, index) => (
                            <span className="ml-2 text-gray-400" key={index}>
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
  )
}

export default Image;