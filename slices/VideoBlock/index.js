import React from "react";
import Vimeo from "@u-wave/react-vimeo";
import { SizeWrapper, StreamPlayer } from "components";

const VideoBlock = ({ slice }) => {
  const {
    video_source,
    vimeo_embed,
    gumlet_url,
    gumlet_poster,
    gumlet_ratio,
    size,
  } = slice.primary;

  return (
    <section className="px-6">
      <SizeWrapper size={size}>
        {video_source === "Gumlet" ? (
          <StreamPlayer
            src={gumlet_url}
            poster={gumlet_poster?.url}
            ratio={gumlet_ratio}
            className="bg-gray-200"
          />
        ) : (
          vimeo_embed?.embed_url && (
            <Vimeo
              video={vimeo_embed.embed_url}
              responsive
              dnt={true}
              autoplay={true}
              muted={true}
              controls={false}
              loop={true}
              className="bg-gray-200"
            />
          )
        )}
      </SizeWrapper>
    </section>
  );
};

export default VideoBlock;
