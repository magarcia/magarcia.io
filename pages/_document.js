import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="https://rsms.me/inter/font-files/Inter-roman.var.woff2?v=3.19"
            as="font"
            type="font/woff2"
            crossOrigin
          />
        </Head>
        <body className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300 ease-in-out motion-reduce:transition-none">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
