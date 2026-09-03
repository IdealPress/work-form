import Vimeo from "@u-wave/react-vimeo";

import {
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
  const { video, image, ratio, size } = item ?? {};

  if (!hasVideo(video)) {
    return <ImageWrapper item={item} sizes={sizes} {...rest} />;
  }

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
        shape={ratioValue(ratio) ?? embedShape(video)}
        cap={isNarrow(size)}
        // A grey placeholder to hold the space the video is about to fill.
        className="bg-gray-200"
      />
    );
  }

  // A Vimeo iframe brings its own player, its own poster and — `responsive` —
  // its own height, worked out from the video's own shape. So there is nothing
  // left here to decide: it takes the width of the cell it was given.
  return (
    <Vimeo
      video={video.embed_url}
      responsive
      dnt={true}
      autoplay={true}
      muted={true}
      controls={false}
      loop={true}
      className="bg-gray-200"
    />
  );
}
