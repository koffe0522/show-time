import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { Fragment } from 'react';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
