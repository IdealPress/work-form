import { PrismicPreview } from "@prismicio/next/pages";

import { repositoryName } from "../prismicio";
import "styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <PrismicPreview repositoryName={repositoryName}>
      {getLayout(<Component {...pageProps} />)}
    </PrismicPreview>
  );
}
