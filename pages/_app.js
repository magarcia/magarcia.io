import { ThemeProvider } from "next-themes";
import Head from "next/head";
import "../styles/global.css";
import "../styles/highlight.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
