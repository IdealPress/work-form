import React from "react";
import Vimeo from "@u-wave/react-vimeo";
import { SizeWrapper, StreamPlayer } from "components";
import { cappedWidth, isNarrow } from "lib";

/*
 * The ratio of the black frame a Vimeo video is dropped into. Vimeo has no
 * ratio field of its own — the frame exists so a tall video keeps the same
 * footprint as a landscape image beside it, so it takes the widest ratio the
 * site uses.
 */
const VIMEO_BOX_RATIO = 16 / 9;

/*
 * `responsive` gives the Vimeo iframe the whole width of its container and
 * works its height out from the video's own shape, so it can't be fitted with
 * object-fit — the only way to keep a tall video inside the frame is to narrow
 * the container until the height it arrives at fits. A video of ratio R in a
 * box of ratio B needs R / B of the width, and never more than all of it.
 *
 * Prismic stores the embed's dimensions alongside its URL. Without them the
 * video keeps the full width, which is what it has always had.
 */
const vimeoFitWidth = (embed) => {
  const ratio = embed?.width / embed?.height;
  if (!Number.isFinite(ratio) || ratio <= 0) return "100%";
  return `${Math.min(100, (100 * ratio) / VIMEO_BOX_RATIO)}%`;
};

const VideoBlock = ({ slice }) => {
  const {
    video_source,
    vimeo_embed,
    gumlet_url,
    gumlet_poster,
    gumlet_ratio,
    size,
    background,
  } = slice.primary;

  const boxed = background === "Black";

  const vimeo = vimeo_embed?.embed_url ? (
    <Vimeo
      video={vimeo_embed.embed_url}
      responsive
      dnt={true}
      autoplay={true}
      muted={true}
      controls={false}
      loop={true}
      // The grey placeholder is there to hold the space a video is about to
      // fill; inside the frame the black is already doing that, and grey would
      // only read as a second box that never goes away.
      className={boxed ? undefined : "bg-gray-200"}
      style={boxed ? { width: vimeoFitWidth(vimeo_embed) } : undefined}
    />
  ) : null;

  return (
    <section className="px-gutter">
      <SizeWrapper size={size}>
        {video_source === "Gumlet" ? (
          <StreamPlayer
            src={gumlet_url}
            poster={gumlet_poster?.url}
            ratio={gumlet_ratio}
            fit={boxed ? "contain" : "cover"}
            cap={isNarrow(size)}
            className={boxed ? "" : "bg-gray-200"}
          />
        ) : boxed && vimeo ? (
          <div
            className="flex items-center justify-center mx-auto bg-black"
            style={{
              aspectRatio: VIMEO_BOX_RATIO,
              maxWidth: isNarrow(size)
                ? cappedWidth(VIMEO_BOX_RATIO)
                : undefined,
            }}
          >
            {vimeo}
          </div>
        ) : (
          vimeo
        )}
      </SizeWrapper>
    </section>
  );
};

export default VideoBlock;
