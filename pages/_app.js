import { PrismicPreview } from "@prismicio/next/pages";
import { ThemeProvider } from "next-themes";

import { repositoryName } from "../prismicio";
import "styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <PrismicPreview repositoryName={repositoryName}>
      <ThemeProvider enableSystem={true} attribute="class">
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </PrismicPreview>
  );
}
