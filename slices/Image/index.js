import React from 'react'
import NextImage from "next/image"
import { SizeWrapper, LinkWrapper } from 'components'

const Image = ({ slice, context }) => (
  <section className="md:flex items-center justify-center px-8 space-y-8 md:space-y-0">
    {slice.items.map((item, index) => (
      <div className="w-full" key={index}>
        <LinkWrapper url={item.link?.url}>
          <SizeWrapper size={item.size}>
            <figure>
              <NextImage
                className="transition group-hover:scale-105 group-focus:hover-scale-105"
                src={item.image[item.ratio].url}
                width={item.image[item.ratio].dimensions.width}
                height={item.image[item.ratio].dimensions.height}  
              />
              <figcaption>
                {item.show_caption && (
                  <>
                    {item.caption ? (
                      <p>{item.caption}</p>
                    ) : (
                      <p className="leading-snug md:text-lg">
                          {context.data.title}
                          {context.tags.map((tag, index) => (
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

export default Image;