import Head from "next/head";
import Link from "next/link";

import { Navigation, Footer } from "components";

import styles from "./DefaultLayout.module.css";

export default function DefaultLayout({ children }) {
  return (
    <>
      <Head>
        <title>work-form</title>
        <meta name="description" content="work-form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.base}>
        <Navigation>
          <li>
            <Link href="/about">
              <a>about</a>
            </Link>
          </li>
          <li>
            <Link href="/projects">
              <a>projects</a>
            </Link>
          </li>
        </Navigation>
        {children}
      </div>
      <Footer />
    </>
  );
}
