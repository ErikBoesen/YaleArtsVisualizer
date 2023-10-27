/*
 * swr.ts
 * Author: Evan Kirkiles
 * Created on: Fri Oct 27 2023
 * 2023 Yale SWE
 */

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());
