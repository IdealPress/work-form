import Link from "next/link";

import { ThemeToggle } from "components";

import styles from "./Navigation.module.css";

export default function Navigation({title = "", children = <li></li>}) {
  return (
    <nav className={styles.base}>
      <Link href="/">
        <a>work-form</a>
      </Link>
      {title && <p className="hidden sm:block text-center">
        {title}
      </p>}
      <ul>
        {children}
        <li className={styles.toggle}>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
