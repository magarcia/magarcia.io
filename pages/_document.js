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
            crossOrigin="true"
          />
          <script
            defer
            data-domain="magarcia.io"
            src="https://plausible.io/js/plausible.js"
          ></script>
        </Head>
        <body className="text-gray-700 transition-colors duration-300 ease-in-out bg-white dark:bg-gray-800 dark:text-gray-200 motion-reduce:transition-none">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
