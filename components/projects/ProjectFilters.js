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

  // Defaults are left out of the query so /projects stays clean.
  const href = (next) => {
    const query = { category, view, ...next };
    if (query.category === DEFAULT_CATEGORY) delete query.category;
    if (query.view === DEFAULT_VIEW) delete query.view;
    return { pathname: router.pathname, query };
  };

  const item = (value, active, next) => (
    <li key={value}>
      <Link
        href={href(next)}
        shallow
        scroll={false}
        aria-current={active ? "true" : undefined}
        className={active ? styles.active : undefined}
      >
        {value}
      </Link>
    </li>
  );

  return (
    <div className={styles.base}>
      <ul className={styles.filters}>
        {[DEFAULT_CATEGORY, ...categories].map((value) =>
          item(value, value === category, { category: value }),
        )}
      </ul>
      <ul className={styles.views}>
        {VIEWS.map((value) => item(value, value === view, { view: value }))}
      </ul>
    </div>
  );
}
