/*
 * index.tsx
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 */

"use client";

import { PropsWithChildren } from "react";
import { Provider } from "jotai";

/**
 * This client component provides all of the providers we need in the main layout.
 *
 * For example, we'll add here the query client for fetching data.
 */
export default function Providers({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>;
}
