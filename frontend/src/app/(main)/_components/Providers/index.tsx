/*
 * index.tsx
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 */

"use client";

import { queryClient } from "@/util/query";
import { PropsWithChildren } from "react";
import { QueryClientProvider } from "react-query";
import { Provider as WrapBalancerProvider } from "react-wrap-balancer";

/**
 * This client component provides all of the providers we need in the main layout.
 *
 * For example, we'll add here the query client for fetching data.
 */
export default function Providers({ children }: PropsWithChildren) {
  return (
    <WrapBalancerProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WrapBalancerProvider>
  );
}
