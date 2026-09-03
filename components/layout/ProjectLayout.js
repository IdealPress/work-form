import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { Navigation, NewsletterBar, Footer } from "components";

import styles from "./ProjectLayout.module.css";
import { useEffect, useState } from "react";

export default function ProjectLayout({
  title = "",
  children,
  newsletter = null,
}) {
  const router = useRouter();

  const toggleText = (e) => {
    if (router.query?.text) {
      const { text, ...rest } = router.query;
      router.replace({
        pathname: router.pathname,
        query: { ...rest },
      });
    } else {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, text: true },
      });
    }
  };

  return (
    <>
      <Head>
        <title>work-form | {title} </title>
        <meta name="description" content="work-form" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className={styles.base}>
        <Navigation title={title}>
          <li>
            <button onClick={toggleText}>
              {router.query?.text ? "image" : "text"}
            </button>
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
      <NewsletterBar newsletter={newsletter} />
      <Footer />
    </>
  );
}
