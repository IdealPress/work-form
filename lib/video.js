/*
 * One place that knows how to turn what an editor pastes into something a
 * <video> can actually play.
 *
 * Gumlet hands out several URLs for a single asset and only one of them is a
 * stream. The share link (`gumlet.tv/watch/<asset>`) and the embed link
 * (`play.gumlet.io/embed/<asset>`) are both HTML pages, so a <video> given
 * either one fails with MEDIA_ERR_SRC_NOT_SUPPORTED and the block renders as an
 * empty box. The stream itself lives at
 * `video.gumlet.io/<collection>/<asset>/main.m3u8`, and the share link is the
 * one Gumlet's own UI offers first — so it is the one that ends up in the CMS.
 *
 * The asset id is in every one of those URLs, the share link included, so the
 * Embed field's own URL is enough to name the asset. The collection id is in
 * none of them, and the only place it survives into Prismic is the rest of that
 * same oEmbed response, whose thumbnail sits on the same path as the manifest:
 *
 *   https://video.gumlet.io/<collection>/<asset>/thumbnail-1-0.png?width=320
 *
 * so one pasted share link carries everything the player needs, as long as the
 * whole embed is read and not just its URL.
 */

// Gumlet ids are 24-character hex, the same shape as a Mongo ObjectId.
const ID = /[0-9a-f]{24}/gi;

const ids = (url) => (typeof url === "string" ? (url.match(ID) ?? []) : []);

// A manifest or a plain media file is already a source; only page URLs need
// rewriting, and a stream URL pasted as the field asks for it must survive
// untouched.
const isPlayable = (url) => /\.(m3u8|mpd|mp4|webm|mov|m4v)(?:[?#]|$)/i.test(url);

/**
 * The HLS manifest for a Gumlet video, from whichever of its URLs the CMS
 * holds. Anything already playable, and anything with no Gumlet ids to read
 * (another CDN's mp4, say), is passed through as it is — a URL we can't improve
 * is better handed to the player than dropped, since a broken source at least
 * reports itself in the console.
 */
export function gumletStream(url, embed) {
  if (!url || isPlayable(url)) return url;

  // The asset is the last id in the URL, so a manifest path reads the same way
  // a watch link does; the collection is the first id on the thumbnail.
  const asset = ids(url).at(-1);
  const collection = ids(embed?.thumbnail_url)[0];
  if (!asset || !collection) return url;

  return `https://video.gumlet.io/${collection}/${asset}/main.m3u8`;
}

/*
 * A poster is what holds the frame while the first segment is still arriving,
 * and an HLS stream has no first frame to show until then. Gumlet generates one
 * for every asset and passes it through the oEmbed response at the size of its
 * own preview — a few hundred pixels, which is visibly soft across a column —
 * but the URL is an image CDN's, so the width is ours to ask for.
 */
const POSTER_WIDTH = 1600;

/** The Gumlet-generated poster for an embed, at a width worth looking at. */
export function gumletPoster(embed) {
  const thumbnail = embed?.thumbnail_url;
  if (!thumbnail) return undefined;

  const url = new URL(thumbnail);
  url.searchParams.set("width", POSTER_WIDTH);
  // The height and dpr in the oEmbed URL describe the preview, not this: the
  // height would crop the larger poster back to the preview's shape, and the
  // dpr would quietly double the width we just asked for.
  url.searchParams.delete("height");
  url.searchParams.delete("dpr");
  return url.toString();
}

/*
 * Ratios are written the way the CMS offers them — "16:9", "4:5", "main" — and
 * both players have to agree on what one means: the stream sizes its own box
 * with it, and a Vimeo iframe is dropped into a frame of the same shape. A
 * number is what each of them wants in the end, since CSS takes a bare
 * `aspect-ratio` and the screen-height cap is arithmetic.
 */
export function ratioValue(ratio) {
  const [width, height] = String(ratio ?? "").split(":").map(Number);
  const value = width / height;
  // "main", an empty select and anything malformed all land here: no shape.
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/** True when the editor has pasted something for this item to play. */
export function hasVideo(embed) {
  return Boolean(embed?.embed_url);
}

/*
 * Which player a video needs is the embed's answer to give, not the editor's.
 * The oEmbed response Prismic stores names the provider it resolved the link
 * with, and it is filled in on every video in the CMS — including the ones
 * saved before there was a source field to set, which is more than the field
 * itself could say. So a Vimeo link becomes an iframe and a Gumlet link becomes
 * an HLS stream, and pasting the link is all either one asks of an editor.
 */
export function isGumlet(embed) {
  return embed?.provider_name === "Gumlet";
}

/**
 * The video's own shape, from the dimensions Prismic stores alongside the URL.
 *
 * This is what "main" means for a video: the same "leave it as it came" the
 * ratio field means for an image, so one option covers both and a video sized
 * that way still reserves its height before the first frame arrives.
 */
export function embedShape(embed) {
  const shape = embed?.width / embed?.height;
  return Number.isFinite(shape) && shape > 0 ? shape : undefined;
}
