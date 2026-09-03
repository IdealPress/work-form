/*
 * One place that knows about image crops.
 *
 * Prismic stores every named crop alongside the original under the image field
 * (`image["16:9"]`), with the uncropped original at the field itself. Crops are
 * only generated for images uploaded *after* the crop was added to the model,
 * and crops get retired from models over time — so asking for a crop by name
 * and using whatever comes back is how images end up missing on old documents.
 * `pickCrop` never returns nothing: it falls back to the nearest crop the image
 * actually has, and to the original as a last resort.
 */

// Every ratio the CMS offers, as a number, so a missing crop can be matched to
// the closest one that exists. Keep in step with the `ratio` Select options in
// the slice models.
export const RATIOS = {
  "21:9": 21 / 9,
  "16:9": 16 / 9,
  "3:2": 3 / 2,
  "4:3": 4 / 3,
  "5:4": 5 / 4,
  "1:1": 1,
  "4:5": 4 / 5,
};

// Tailwind classes, written out in full so they survive the class scan.
export const ASPECT_CLASS = {
  "21:9": "aspect-21/9",
  "16:9": "aspect-16/9",
  "3:2": "aspect-3/2",
  "4:3": "aspect-4/3",
  "5:4": "aspect-5/4",
  "1:1": "aspect-square",
  "4:5": "aspect-4/5",
};

// The uncropped original — and, for a video, its own shape rather than a frame
// cut to one. The two are the same choice written once: leave it as it came.
export const MAIN = "main";

/**
 * The image data for `ratio`: the named crop if it exists, otherwise the
 * closest crop the image does have, otherwise the original.
 */
export function pickCrop(image, ratio) {
  if (!image) return undefined;
  if (!ratio || ratio === MAIN) return image;

  const exact = image[ratio];
  if (exact?.url) return exact;

  const target = RATIOS[ratio];
  if (!target) return image;

  const nearest = Object.keys(RATIOS)
    .filter((name) => image[name]?.url)
    .sort(
      (a, b) => Math.abs(RATIOS[a] - target) - Math.abs(RATIOS[b] - target),
    )[0];

  return nearest ? image[nearest] : image;
}

/** True when the image has usable data for `ratio` (or an original to fall back on). */
export function hasImage(image) {
  return Boolean(image?.url);
}

/**
 * The screen-height cap for something of this shape (width over height), as a
 * max-width. Nothing on the site is taller than the screen it is being read on,
 * and every kind of thing that has to obey that — an image, a cycling box, a
 * video — obeys it through its width.
 *
 * A width because it is what centring can work with: auto margins are resolved
 * before a height cap narrows an element, so an image held by its height gives
 * up all its space on one side and sits against the left of its column. For a
 * box the reason is different but points the same way — a box has no size of
 * its own to scale down, so a height cap leaves its width alone and simply
 * crops whatever is inside it.
 *
 * Held against 100% as well, because an inline max-width overrides the one
 * Tailwind's reset puts on every image — without the `min()` a wide crop whose
 * cap came out larger than its column would sit outside it.
 *
 * Rounded, because the shape is the ratio of two pixel counts and the tail of
 * it is worth less than a quarter of a pixel across the widest crop we hold.
 */
export function cappedWidth(shape) {
  if (!Number.isFinite(shape) || shape <= 0) return undefined;
  return `min(100%, calc(var(--image-height) * ${Number(shape.toFixed(4))}))`;
}

/**
 * The screen-height cap for a Prismic image at a given ratio, ready to hand to
 * the figure that lays it out.
 */
export function imageCap(image, ratio) {
  const { width, height } = pickCrop(image, ratio)?.dimensions ?? {};
  return cappedWidth(width / height);
}

/**
 * Animated images can't be optimised — Next fetches them and hands them
 * straight on — so routing one through the optimiser buys nothing but a large
 * server-side download and, past seven seconds, a timeout and a 500. They are
 * better fetched from Prismic's CDN directly.
 */
export function isAnimated(source) {
  return /\.gif($|\?)/i.test(source?.url ?? "");
}

/**
 * The same crop, rendered no larger than the region it was cut from.
 *
 * Prismic renders a crop by pointing `rect` at a region of the original and
 * `w`/`h` at the size to draw it at, and a named crop asks for the size in the
 * model however few pixels the picture actually has. For a still that upscale
 * is merely wasteful — the optimiser resizes it back down. For an animation it
 * is ruinous: a 358x201 GIF redrawn at 2500x1406 arrives as 22MB, and nothing
 * downstream can shrink it. Holding the output to the region's own pixels
 * leaves the editor's framing exactly as they set it, and adds no softness that
 * upscaling wasn't adding already.
 */
export function withoutUpscale(url) {
  const rect = url?.match(/[?&]rect=\d+,\d+,(\d+),(\d+)/);
  const width = url?.match(/[?&]w=(\d+)/);
  if (!rect || !width || Number(width[1]) <= Number(rect[1])) return url;

  return url
    .replace(/([?&]w=)\d+/, `$1${rect[1]}`)
    .replace(/([?&]h=)\d+/, `$1${rect[2]}`);
}

// Everything that isn't full width sits at the same two-thirds — including the
// retired "Medium" and "Small" still held by older documents.
const NARROW = ["regular", "medium", "small"];

/**
 * True for any size that isn't "Full". The one place the size vocabulary is
 * read, so the width an image is given, the `sizes` hint it asks the browser
 * for, and whether the screen-height cap applies to it can't drift apart.
 */
export function isNarrow(size) {
  return NARROW.includes(String(size).toLowerCase());
}

/**
 * A `sizes` hint for an image laid out as one of `count` items in a row, at
 * the given size. Without this every image asks for a 3840px source, which is
 * the difference between a page that arrives and one that trickles.
 *
 * Rows stack on mobile, so the small-screen branch is always the full width.
 */
export function rowSizes(count = 1, size) {
  const share = isNarrow(size) ? 66 : 100;
  return `(min-width: 768px) ${Math.round(share / Math.max(count, 1))}vw, 100vw`;
}
