import Link from "next/link";

import { Reveal } from "components";

import styles from "./NewsletterBar.module.css";

const DEFAULT_LABEL = "subscribe";

/*
 * The black bar above the footer. Signup happens on whichever service the
 * studio is using, so this is presentational — copy and destination come from
 * the home document and the link opens in a new tab.
 */
export default function NewsletterBar({ content }) {
  const text = content?.data?.newsletter_text?.trim();
  const url = content?.data?.newsletter_link?.url;

  // A bar with nothing in it would read as a mistake, so an unfilled home
  // document simply has no bar.
  if (!text || !url) return null;

  const label = content?.data?.newsletter_label?.trim() || DEFAULT_LABEL;

  return (
    <Reveal as="section" variant="fade" className={styles.base}>
      <div className={styles.row}>
        <p className={styles.message}>{text}</p>
        {/* The editor's label leads the accessible name so what is read out
            still starts with what is on screen. */}
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} to the work-form newsletter`}
          className={styles.button}
        >
          {label}
        </Link>
      </div>
    </Reveal>
  );
}
