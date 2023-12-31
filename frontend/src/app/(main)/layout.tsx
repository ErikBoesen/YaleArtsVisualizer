/*
 * layout.tsx
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 */

import Providers from "@/app/(main)/_components/Providers";
import Header from "@/components/Header";
import SplashScreen from "@/components/SplashScreen";
import { GA4_TAG } from "@/env";
import dynamic from "next/dynamic";
import Script from "next/script";
import { PropsWithChildren } from "react";

const Graph = dynamic(() => import("@/components/Graph"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_TAG}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${GA4_TAG}');
      `}
      </Script>
      <Header />
      {/* TODO: Layout components */}
      <main>{children}</main>
      <Graph />
      <SplashScreen />
    </Providers>
  );
}
