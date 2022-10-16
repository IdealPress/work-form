import Head from "next/head";

import { Navigation, Footer } from "components";

import styles from "./DefaultLayout.module.css";

export default function DefaultLayout({ children }) {
  return (
    <div className={styles.base}>
      <Head>
        <title>work-form</title>
        <meta name="description" content="work-form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
