/*
 * layout.tsx
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 */
import type { Metadata } from "next";
import { ABCDiatype } from "@/fonts";
import { ColorSchemeScript } from "@/util/earlyScripts";
import { SITE_URL } from "@/env";
import s from "./Layout.module.scss";
import "./globals.scss";

// Base metadata for the entire app
export const metadata: Metadata = {
  title: "Yale Arts Map — A visual graph of the Yale performance scene.",
  description: "TBD",
  metadataBase: new URL(SITE_URL),
};

/**
 * A root layout in which both the main app and the sanity studio are wrapped.
 * Apply font classes here to keep your DOM clean of unnecessary <div />'s.
 * Here, you can also add information about your favicon. Use this tool always:
 *  - https://realfavicongenerator.net
 * Then paste the HTML code here, the files in /public, and close the closing carets.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ABCDiatype.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#312a7b" />
        <meta name="msapplication-TileColor" content="#312a7b" />
        <meta name="theme-color" content="#00356B" />
        {/* <ColorSchemeScript /> */}
      </head>
      <body className={s.body}>{children}</body>
    </html>
  );
}
