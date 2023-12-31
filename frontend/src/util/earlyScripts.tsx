/*
 * earlyScripts.tsx
 * Author: evan kirkiles
 * Created On Sun Aug 27 2023
 * 2023 Design at Yale
 *
 * Defines "early scripts", which are inlined scripts to run before any Next.js
 * code is loaded. Their placement at the top of the HTML document allows them
 * to run before the DOM is rendered and so prevent any flash of unstyled content,
 * e.g. to add darkmode classes to the <html /> node before the page hydrates.
 */

import { any as javascript } from "code-tag";

/* ------------------------------- Theme Color ------------------------------ */

const COLOR_SCHEME_INLINE = javascript`
if (typeof window !== "undefined") { 
  let colorScheme = localStorage.getItem("yam-color-scheme") || "auto";
  if (colorScheme == "auto") {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    colorScheme = mql.matches ? "dark" : "light";
  }
  document.documentElement.classList.add(\`\${colorScheme}-mode\`);
}
`;

export const ColorSchemeScript = () => (
  <script
    id="color-scheme-script"
    type="text/javascript"
    dangerouslySetInnerHTML={{
      __html: COLOR_SCHEME_INLINE,
    }}
  />
);
