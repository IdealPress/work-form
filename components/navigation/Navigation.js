import Link from "next/link";

import { ThemeToggle } from "components";

import styles from "./Navigation.module.css";

export default function Navigation({title = "", children = <li></li>}) {
  return (
    <nav className={styles.base}>
      <div className="sm:w-1/4">
        <Link href="/">
          <a>work-form</a>
        </Link>
      </div>
      <div className="sm:w-2/4">
        {title && <p className="hidden sm:block text-center">
          {title}
        </p>}
      </div>
      <div className="sm:w-1/4">
        <ul>
          {children}
          <li className={styles.toggle}>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
