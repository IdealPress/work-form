import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./ProjectFilters.module.css";

export const DEFAULT_VIEW = "selected";
export const DEFAULT_CATEGORY = "all";
export const VIEWS = [DEFAULT_VIEW, "index"];

/*
 * The view and the active filter live in the URL so a filtered index can be
 * linked to. /projects is statically optimised, so `query` is empty until the
 * router is ready and the defaults stand in until then.
 */
export function useProjectView(categories = []) {
  const { query } = useRouter();

  return {
    view: VIEWS.includes(query.view) ? query.view : DEFAULT_VIEW,
    category: categories.includes(query.category)
      ? query.category
      : DEFAULT_CATEGORY,
  };
}

export default function ProjectFilters({ categories = [] }) {
  const router = useRouter();
  const { view, category } = useProjectView(categories);

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Pointer rather than click, and guarded by the control's own subtree, so
    // neither the press that opened the panel nor a press inside it counts as
    // being outside.
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    // The whole lede collapses and goes inert as soon as the page leaves the
    // top, so the panel goes with it rather than being left hanging over the
    // page.
    const close = () => setOpen(false);

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close);
    };
  }, [open]);

  // Defaults are left out of the query so /projects stays clean.
  const href = (next) => {
    const query = { category, view, ...next };
    if (query.category === DEFAULT_CATEGORY) delete query.category;
    if (query.view === DEFAULT_VIEW) delete query.view;
    return { pathname: router.pathname, query };
  };

  const item = (value, active, next, onClick) => (
    <li key={value}>
      <Link
        href={href(next)}
        shallow
        scroll={false}
        onClick={onClick}
        aria-current={active ? "true" : undefined}
        className={active ? styles.active : undefined}
      >
        {value}
      </Link>
    </li>
  );

  return (
    <div ref={rootRef} className={`${styles.base} ${open ? styles.open : ""}`}>
      <div className={styles.dropdown}>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
        >
          filter
        </button>
        {/* One list, two presentations: the panel the button drops open on a
            phone, and the plain row of categories at md, where there is width
            for all of them. Rendered either way rather than mounted with the
            panel, so the desktop row isn't at the mercy of a piece of state
            that only means anything on a phone. */}
        <ul className={`${styles.options} ${open ? styles.optionsOpen : ""}`}>
          {[DEFAULT_CATEGORY, ...categories].map((value) =>
            item(value, value === category, { category: value }, () =>
              setOpen(false),
            ),
          )}
        </ul>
      </div>
      <ul className={styles.views}>
        {VIEWS.map((value) => item(value, value === view, { view: value }))}
      </ul>
    </div>
  );
}
