import Link from "next/link";

import { ThemeToggle } from "components";

import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.base}>
      <Link href="/">
        <a>work-form</a>
      </Link>
      <ul>
        <li>
          <Link href="/about">
            <a>about</a>
          </Link>
        </li>
        <li>
          <Link href="/archive">
            <a>archive</a>
          </Link>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
