import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";

import Layout from "@src/components/layout";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Layout hasTabBar>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
        closeOnClick
      />
    </SWRConfig>
  );
}

export default MyApp;
