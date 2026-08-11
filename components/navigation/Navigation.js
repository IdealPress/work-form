import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useReveal } from "lib";

import styles from "./Navigation.module.css";
import { usePathname } from "next/navigation";

// How far down the page we need to be before the nav is allowed to hide, and
// how much movement counts as a deliberate scroll (rather than rubber-banding).
const HIDE_AFTER = 80;
const THRESHOLD = 8;

// Pages that use different layouts (`/projects` vs a project page) mount
// different Navigation instances, so `hidden` is lost on the way across. Module
// scope survives that remount and lets the new nav slide down from where the
// old one was, rather than appearing already in place. Only ever written from
// the browser, so it stays false during SSR.
let leftHidden = false;

function useScroll() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let previous = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      setAtTop(current <= 0);

      if (Math.abs(current - previous) < THRESHOLD) return;
      const next = current > previous && current > HIDE_AFTER;
      leftHidden = next;
      setHidden(next);
      previous = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { hidden, atTop };
}

// True for the first moments after arriving on a page we reached with the nav
// scrolled away, so it can be rendered in the up position and then released.
function useEntrance() {
  const [entering, setEntering] = useState(() => leftHidden);

  useEffect(() => {
    if (!entering) return;
    leftHidden = false;

    // Let the browser paint the up position before dropping the class,
    // otherwise there is no start value to transition from.
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntering(false));
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [entering]);

  return entering;
}

// Keyed on the title by its parent, so arriving at a new project replays the
// fade. `useReveal` doubles as the trigger: while the nav is still up the title
// is off-screen, so it resolves as the nav arrives rather than before it.
function NavTitle({ title }) {
  const [ref, inView] = useReveal();

  return (
    <p
      ref={ref}
      className={`hidden sm:block text-center ${styles.title} ${
        inView ? styles.titleVisible : ""
      }`}
    >
      {title}
    </p>
  );
}

const HOME_LEDE = (
  <p>
    Designing identities, books, websites and exhibitions for arts and culture
  </p>
);

export default function Navigation({
  title = "",
  children = <li></li>,
  lede = null,
}) {
  const router = useRouter();
  const path = usePathname();
  const isHome = path === "/";
  const { hidden, atTop } = useScroll();
  const entering = useEntrance();

  // Pages can supply their own lede; the home page falls back to the strapline.
  const ledeContent = lede ?? (isHome ? HOME_LEDE : null);

  return (
    <>
      <nav
        className={`${styles.base} ${hidden ? styles.hidden : ""} ${
          entering ? styles.entering : ""
        }`}
      >
        <div className={styles.wrapper}>
          <div className="sm:w-4/12">
            <Link href="/">work-form</Link>
          </div>
          {title && (
            <div className="sm:w-5/12">
              {!router.query.text && <NavTitle key={title} title={title} />}
            </div>
          )}
          <div className="sm:w-4/12">
            <ul>{children}</ul>
          </div>
        </div>
        {ledeContent && (
          <div
            className={`${styles.lede} ${atTop ? "" : styles.ledeHidden}`}
            aria-hidden={!atTop}
            inert={!atTop}
          >
            {ledeContent}
          </div>
        )}
      </nav>
    </>
  );
}
