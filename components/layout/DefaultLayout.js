import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Navigation, Footer } from "components";

import styles from "./DefaultLayout.module.css";

export default function DefaultLayout({ children, lede = null }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>work-form</title>
        <meta name="description" content="work-form" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className={styles.base}>
        <Navigation lede={lede}>
          <li>
            <Link
              href="/about"
              className={
                router.pathname.includes("about") ? "text-grey" : undefined
              }
            >
              about
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={
                router.pathname.includes("projects") ? "text-grey" : undefined
              }
            >
              projects
            </Link>
          </li>
        </Navigation>
        {children}
      </div>
      <Footer />
    </>
  );
}
