// RUTA: src/pages/_app.tsx

import "@/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Sofia_Sans_Condensed } from 'next/font/google';
import Layout from "@/components/Layout";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { registerServiceWorker } from '@/utils/registerSW';
import { useEffect, useState } from "react";
import InitialLoader from "@/components/InitialLoader";

const sofia = Sofia_Sans_Condensed({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const INITIAL_LOAD_KEY = 'app-initial-load-complete';

export default function App({ Component, pageProps }: AppProps) {
  // Inicia siempre en `false` para que el servidor y el cliente coincidan
  const [appReady, setAppReady] = useState(false);

  //@ts-ignore 
  const getLayout = Component.getLayout || ((page: any) => (
    <Layout className={sofia.className}>
      {!appReady && <InitialLoader onComplete={() => setAppReady(true)} />}
      {page}
    </Layout>
  ));

  useEffect(() => {
    registerServiceWorker();

    // La lógica que depende del navegador se ejecuta aquí, después del primer render
    const hasLoadedBefore = localStorage.getItem(INITIAL_LOAD_KEY) === 'true';
    if (hasLoadedBefore) {
      setAppReady(true);
    }
  }, []);


  return (
    <Provider store={store}>
      <GoogleAnalytics gaId="G-4TB8NSECJE" />
      {/* <Layout className={sofia.className}>
        <Component {...pageProps} />
      </Layout> */}
      {getLayout(<Component {...pageProps} />)}
      {process.env.NODE_ENV === 'production' && (
        <Script id="hotjar-script" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:5051983,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      )}
    </Provider>
  );
}