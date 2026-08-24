import { useCallback, useState } from "react";

/**
 * Reports whether the referenced element is on screen *right now*, and keeps
 * reporting. `useReveal` latches true the first time and disconnects, because a
 * reveal only ever happens once; anything that runs while it is being watched —
 * an auto-playing carousel — needs to hear about the trip back out of view too.
 *
 * Returns `[ref, inView]`. The ref is a callback ref so the observer is
 * attached the moment the node lands, and torn down when it unmounts.
 */
export default function useInView() {
  // A browser with no observer to ask is told everything is visible: whatever
  // waits on this is better off running unprompted than never running at all.
  // The server is not, even though it can't ask either — it renders the markup
  // the client then has to hydrate, and the two have to agree until the first
  // real answer arrives.
  const [inView, setInView] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof IntersectionObserver === "undefined",
  );

  const ref = useCallback((node) => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    // No margin and the default threshold: unlike a reveal, which waits for an
    // element to clear the fold before it is worth animating, this is asking
    // whether the element is in front of the reader at all.
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}
