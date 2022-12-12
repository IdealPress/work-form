import Head from "next/head";
import Link from "next/link"
import { useRouter } from "next/router";

import { Navigation, Footer } from "components";

import styles from "./ProjectLayout.module.css";
import { useEffect, useState } from "react";

export default function ProjectLayout({ children }) {
    const router =  useRouter();

    
    const toggleText = (e) => {
        if (router.query?.text) {
            const { text, ...rest } = router.query
            console.log(rest)
            router.replace({
                pathname: router.pathname,
                query: { ...rest },
            })
        } else {
            router.replace({
                pathname: router.pathname,
                query: { ...router.query, text: true },
            })
        }
    }

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
                        <button onClick={toggleText}>{router.query?.text ? 'image' : 'text'}</button>
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
