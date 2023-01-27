import Link from "next/link";
import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { ThemeProvider } from "next-themes";

import { linkResolver, repositoryName } from "../prismicio";
import "styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>{children}</a>
        </Link>
      )}
    >
      <PrismicPreview repositoryName={repositoryName}>
        <ThemeProvider enableSystem={true} attribute="class">
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </PrismicPreview>
    </PrismicProvider>
  );
}
