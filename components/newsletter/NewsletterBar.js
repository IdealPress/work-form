import { useState } from "react";

import { Reveal } from "components";
import { FALLBACK_URL } from "lib";

import NewsletterDialog from "./NewsletterDialog.js";

import styles from "./NewsletterBar.module.css";

const DEFAULT_LABEL = "subscribe";

/*
 * The black bar above the footer. The copy is the editor's; the button opens
 * the signup panel.
 *
 * It is a link rather than a button, pointing at listmonk's own hosted form,
 * and the dialog is what the click handler puts in its way. A button here would
 * do nothing at all for a reader whose script has not arrived or has failed,
 * whereas a link still goes somewhere they can sign up.
 */
export default function NewsletterBar({ newsletter }) {
  const [open, setOpen] = useState(false);

  const text = newsletter?.text?.trim();

  // A bar with nothing in it would read as a mistake, so an unfilled home
  // document simply has no bar — on any page.
  if (!text) return null;

  const label = newsletter?.label?.trim() || DEFAULT_LABEL;

  return (
    <>
      <Reveal as="section" variant="fade" className={styles.base}>
        <div className={styles.row}>
          <p className={styles.message}>{text}</p>
          {/* The editor's label leads the accessible name so what is read out
              still starts with what is on screen. */}
          <a
            href={FALLBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} to the work-form newsletter`}
            className={styles.button}
            onClick={(event) => {
              // A modified click is a request for the link itself — a new tab,
              // a new window — so it is left to the browser and lands on
              // listmonk's own form.
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              setOpen(true);
            }}
          >
            {label}
          </a>
        </div>
      </Reveal>

      {/* Outside the Reveal: that wrapper animates a filter, and a dialog is
          better off with no ancestor whose paint it has to escape. */}
      <NewsletterDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
