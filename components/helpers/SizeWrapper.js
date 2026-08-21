import { isNarrow } from "lib";

import styles from "./SizeWrapper.module.css";

/*
 * Images are meant to read large, so there are only two widths: an image fills
 * its column, or it sits at roughly two thirds of it, centred. Anything
 * narrower than that belongs in a row with another image rather than being
 * shrunk on its own.
 *
 * `isNarrow` is what decides, and it also covers the "Medium" and "Small" still
 * held by documents saved before the three sizes became two — Medium was always
 * this width, and Small is retired to it as well, since a third of a column now
 * reads as a mistake rather than a choice.
 */
const selectSize = (size) => (isNarrow(size) ? "w-full md:w-2/3" : "w-full");

export default function SizeWrapper({ size, children }) {
  return <div className={`${styles.base} ${selectSize(size)}`}>{children}</div>;
}
