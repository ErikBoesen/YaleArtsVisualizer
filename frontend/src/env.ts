/*
 * env.ts
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 *
 * A file to declare required .env variables for your app.
 */

export const NODE_ENV = process.env.NODE_ENV!;

// Should be the domain you want to host your site at, for generating metadata
// as well as sitemaps.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";

// GA4 Google tag id (e.g. G-XXXXXXXXXX)
export const GA4_TAG = process.env.NEXT_PUBLIC_GA4_TAG;
