import Link from "next/link";
import { useRouter } from "next/router";

import { ThemeToggle } from "components";

import styles from "./Navigation.module.css";

export default function Navigation({title = "", children = <li></li>}) {
  const router = useRouter();
  return (
    <nav className={styles.base}>
      <div className="sm:w-4/12">
        <Link href="/">
          <a>work-form</a>
        </Link>
      </div>
      {title && (
        <div className="sm:w-5/12">
          {!router.query.text && (
            <p className="hidden sm:block text-center">
              {title}
            </p>
          )}
        </div>
      )}
      <div className="sm:w-4/12">
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
