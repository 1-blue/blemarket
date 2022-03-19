import "../styles/globals.css";
import type { AppProps } from "next/app";

import Layout from "@src/components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout title="제목" canGoBack hasTabBar>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
