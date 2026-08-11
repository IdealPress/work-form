import { useCallback, useState } from "react";

// The negative bottom margin means an element has to clear the fold by ~10%
// before it counts as in view, rather than revealing on its first pixel.
const ROOT_MARGIN = "0px 0px -10% 0px";

/**
 * Flips to `true` the first time the referenced element scrolls into view, and
 * stays there — reveals happen once, they don't replay on scroll-up.
 *
 * Returns `[ref, inView, initiallyVisible]`, where `initiallyVisible` marks an
 * element that was already on screen when the page loaded rather than one
 * scrolled to later, so callers can stagger the arrival of a first screenful
 * without holding up everything below it.
 *
 * The ref is a callback ref so the observer is attached the moment the node
 * lands, and torn down when it unmounts.
 */
export default function useReveal() {
  const [state, setState] = useState({ inView: false, initiallyVisible: false });

  const ref = useCallback((node) => {
    if (!node) return;

    // Without an observer we show the element immediately rather than leaving
    // it stranded at opacity 0 — and without a delay, since the point of the
    // fallback is to get out of the way.
    if (typeof IntersectionObserver === "undefined") {
      setState({ inView: true, initiallyVisible: false });
      return;
    }

    // An observer always delivers one callback describing the state at the
    // moment it started watching. Intersecting on that first callback is what
    // separates "on screen at load" from "scrolled to".
    let first = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const atLoad = first;
        first = false;

        if (!entry.isIntersecting) return;
        setState({ inView: true, initiallyVisible: atLoad });
        observer.disconnect();
      },
      { rootMargin: ROOT_MARGIN }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, state.inView, state.initiallyVisible];
}
