import { useEffect, useId, useRef, useState } from "react";

import { FALLBACK_URL, LIST_UUID, subscribe } from "lib";

import styles from "./NewsletterDialog.module.css";

/*
 * The signup panel the bar's button opens.
 *
 * A native <dialog> opened with `showModal()`, rather than a div with a high
 * z-index, because that is what supplies the parts of a modal that are tedious
 * to get right and invisible when they are missing: the page behind goes inert,
 * focus is held inside, Escape closes, and it renders in the top layer, above
 * a sticky nav without either of them having to agree a z-index.
 *
 * There is no dimmed backdrop. The panel is a white card with a shadow over a
 * white page, which is how the rest of the site separates one surface from
 * another — the shadow is the same two-layer cast as `.image-shadow`.
 */
export default function NewsletterDialog({ open, onClose }) {
  const ref = useRef(null);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  // Controlled, so that reopening the panel clears the tick as well as the
  // message — consent given once is not consent given again.
  const [consented, setConsented] = useState(false);
  const titleId = useId();
  const emailId = useId();
  const consentId = useId();

  // `open` is the prop; `dialog.open` is the element's own state, which Escape
  // changes without asking. Comparing the two is what keeps a second
  // `showModal()` — which throws on an already-open dialog — from being called.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      // A panel reopened still showing last time's confirmation would read as
      // having submitted something.
      setStatus(null);
      setSending(false);
      setConsented(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;

    // Read before awaiting: `currentTarget` is null by the time a handler
    // resumes.
    const data = new FormData(event.currentTarget);

    setSending(true);
    setStatus(null);
    // Both the disabled button and the `sending` guard: a double submit is the
    // commonest way to send somebody two confirmation emails.
    const result = await subscribe(
      String(data.get("email")).trim(),
      data.get("consent") !== null,
    );
    setSending(false);
    setStatus(result);
  };

  /*
   * A press on the backdrop lands on the dialog itself, since the backdrop is
   * its pseudo-element — but so does a press on the card's own padding, and a
   * keyboard activation inside reports coordinates of 0. Testing the point
   * against the card's box separates the three.
   */
  const onPointerDown = (event) => {
    if (event.target !== ref.current) return;

    const { top, right, bottom, left } = ref.current.getBoundingClientRect();
    const inside =
      event.clientX >= left &&
      event.clientX <= right &&
      event.clientY >= top &&
      event.clientY <= bottom;

    if (!inside) onClose();
  };

  const done = status?.ok === true;

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onPointerDown={onPointerDown}
      // Escape and `dialog.close()` both fire this, so it is the one place the
      // parent's state has to be told the panel is shut.
      onClose={onClose}
    >
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          Newsletter
        </h2>
        <button type="button" className={styles.close} onClick={onClose}>
          close
        </button>
      </div>

      {/*
       * `action` and the hidden list field are the form's own fallback: the
       * submit handler takes over whenever the script is running, and without
       * it the browser posts to listmonk's hosted form and lands on its
       * confirmation page.
       */}
      <form
        className={styles.form}
        method="post"
        action={FALLBACK_URL}
        onSubmit={onSubmit}
      >
        <input type="hidden" name="l" value={LIST_UUID} />

        {!done && (
          <>
            <div className={styles.field}>
              <label htmlFor={emailId} className="sr-only">
                Email address
              </label>
              <input
                id={emailId}
                className={styles.input}
                type="email"
                name="email"
                required
                autoComplete="email"
                autoFocus
                maxLength={1000}
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className={styles.submit}
                data-ready={consented}
                disabled={sending}
              >
                {sending ? "sending" : "subscribe"}
              </button>
            </div>

            <div className={styles.consent}>
              <input
                id={consentId}
                className={styles.checkbox}
                type="checkbox"
                name="consent"
                required
                checked={consented}
                onChange={(event) => setConsented(event.target.checked)}
              />
              <label htmlFor={consentId}>
                Please send me an occasional newsletter. I understand that I can
                unsubscribe at any time
              </label>
            </div>
          </>
        )}

        {/*
         * Present from the first render and never unmounted, so that what it is
         * given later is announced. A live region added at the same moment as
         * its own text usually is not.
         */}
        <p className={styles.status} role="status" aria-live="polite">
          {status?.message ?? ""}
        </p>
      </form>
    </dialog>
  );
}
