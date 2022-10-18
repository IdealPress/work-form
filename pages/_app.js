import { ThemeProvider } from "next-themes";
import "styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}
