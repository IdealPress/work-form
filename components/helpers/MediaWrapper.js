import Vimeo from "@u-wave/react-vimeo";

import {
  cappedWidth,
  embedShape,
  gumletPoster,
  gumletStream,
  hasVideo,
  isGumlet,
  isNarrow,
  pickCrop,
  ratioValue,
} from "lib";

import ImageWrapper from "./ImageWrapper";
import StreamPlayer from "./StreamPlayer";

/*
 * The shape of the black frame a boxed video is dropped into, when neither the
 * ratio field nor the embed itself names one. The frame exists so a tall video
 * keeps the same footprint as a landscape image beside it, so its default is
 * the widest ratio the site uses.
 */
const DEFAULT_BOX_RATIO = 16 / 9;

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
const vimeoFitWidth = (embed, box) => {
  const shape = embedShape(embed);
  if (!shape) return "100%";
  return `${Math.min(100, (100 * shape) / box)}%`;
};

/**
 * One item of a media slice, rendered as whatever the editor actually filled
 * in: a video if they pasted one, otherwise the picture.
 *
 * A video and an image are the same editorial thing — a frame in a row, of a
 * chosen shape and size, with a caption under it — so they take the same item
 * and differ only in what fills the frame. The image field does double duty
 * when a video is present: it becomes the poster, cropped to the same ratio the
 * video is framed at, so the still that holds the space is the still the editor
 * chose rather than whichever frame the host happened to grab.
 *
 * `ratio` is read once, here: "main" is a video's own shape just as it is an
 * image's uncropped original, and everything downstream is handed a number.
 */
export default function MediaWrapper({ item, sizes, ...rest }) {
  const { video, image, ratio, size, background } = item ?? {};

  if (!hasVideo(video)) {
    return <ImageWrapper item={item} sizes={sizes} {...rest} />;
  }

  const boxed = background === "Black";
  const shape = ratioValue(ratio) ?? embedShape(video);

  if (isGumlet(video)) {
    /*
     * The whole embed goes to the player, not just its URL: the link names the
     * asset, and the thumbnail alongside it names the collection the stream
     * lives under. An uploaded poster wins over Gumlet's own, which is only
     * there so the frame isn't empty while the first segment loads.
     */
    return (
      <StreamPlayer
        src={gumletStream(video.embed_url, video)}
        poster={pickCrop(image, ratio)?.url ?? gumletPoster(video)}
        shape={shape}
        fit={boxed ? "contain" : "cover"}
        cap={isNarrow(size)}
        // The grey placeholder is there to hold the space a video is about to
        // fill; inside the frame the black is already doing that.
        className={boxed ? "" : "bg-gray-200"}
      />
    );
  }

  // A Vimeo iframe brings its own player and its own poster, so all that is
  // left to decide is how wide it may be.
  const box = shape ?? DEFAULT_BOX_RATIO;

  const vimeo = (
    <Vimeo
      video={video.embed_url}
      responsive
      dnt={true}
      autoplay={true}
      muted={true}
      controls={false}
      loop={true}
      className={boxed ? undefined : "bg-gray-200"}
      style={boxed ? { width: vimeoFitWidth(video, box) } : undefined}
    />
  );

  if (!boxed) return vimeo;

  return (
    <div
      className="flex items-center justify-center mx-auto bg-black"
      style={{
        aspectRatio: box,
        maxWidth: isNarrow(size) ? cappedWidth(box) : undefined,
      }}
    >
      {vimeo}
    </div>
  );
}
