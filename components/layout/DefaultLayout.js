import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Navigation, Footer } from "components";

import styles from "./DefaultLayout.module.css";

export default function DefaultLayout({ children }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>work-form</title>
        <meta name="description" content="work-form" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className={styles.base}>
        <Navigation>
          <li>
            <Link href="/about">
              <a className={router.pathname.includes('about') ? "text-gray-400" : undefined}>
                about
              </a>
            </Link>
          </li>
          <li>
            <Link href="/projects">
              <a className={router.pathname.includes('projects') ? "text-gray-400" : undefined}>
                projects
              </a>
            </Link>
          </li>
        </Navigation>
        {children}
      </div>
      <Footer />
    </>
  );
}
