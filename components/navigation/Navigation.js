import Link from "next/link";

import { ThemeToggle } from "components";

import styles from "./Navigation.module.css";

export default function Navigation({children = <li></li>}) {
  return (
    <nav className={styles.base}>
      <Link href="/">
        <a>work-form</a>
      </Link>
      <ul>
        {children}
        <li className={styles.toggle}>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
