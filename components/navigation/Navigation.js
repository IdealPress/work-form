import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./Navigation.module.css";
import { usePathname } from "next/navigation";

// How far down the page we need to be before the nav is allowed to hide, and
// how much movement counts as a deliberate scroll (rather than rubber-banding).
const HIDE_AFTER = 80;
const THRESHOLD = 8;

function useScroll() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let previous = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      setAtTop(current <= 0);

      if (Math.abs(current - previous) < THRESHOLD) return;
      setHidden(current > previous && current > HIDE_AFTER);
      previous = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { hidden, atTop };
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

  // Pages can supply their own lede; the home page falls back to the strapline.
  const ledeContent = lede ?? (isHome ? HOME_LEDE : null);

  return (
    <>
      <nav className={`${styles.base} ${hidden ? styles.hidden : ""}`}>
        <div className={styles.wrapper}>
          <div className="sm:w-4/12">
            <Link href="/">work-form</Link>
          </div>
          {title && (
            <div className="sm:w-5/12">
              {!router.query.text && (
                <p className="hidden sm:block text-center">{title}</p>
              )}
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
