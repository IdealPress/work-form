import React from 'react'
import Vimeo from "@u-wave/react-vimeo";
import { SizeWrapper } from 'components';

const VideoBlock = ({ slice }) => (
  <section className="px-6 md:px-8">
    <SizeWrapper size={slice.primary.size}>
      <Vimeo
        video={slice.primary.vimeo_embed.embed_url}
        responsive
        dnt={true}
        autoplay={true}
        muted={true}
        controls={false}
        loop={true}
        className="bg-gray-200"
      />
    </SizeWrapper>
  </section>
)

export default VideoBlock