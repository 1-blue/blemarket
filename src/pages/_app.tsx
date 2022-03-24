import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

import Layout from "@src/components/layout";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Layout hasTabBar>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}

export default MyApp;
