/*
 * layout.tsx
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 */

import Providers from "@/app/(main)/_components/Providers";
import Graph from "@/components/Graph";
import Header from "@/components/Header";
import SplashScreen from "@/components/SplashScreen";
import { GA4_TAG } from "@/env";
import Script from "next/script";
import { PropsWithChildren } from "react";

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
      {children}
      <Graph />
      <SplashScreen />
    </Providers>
  );
}
