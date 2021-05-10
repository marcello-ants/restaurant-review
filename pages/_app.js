import * as React from "react";
import Head from "next/head";
import "../css/style.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Restaurant Review</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
