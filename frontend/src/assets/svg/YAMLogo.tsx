/*
 * DAY.tsx
 * Author: evan kirkiles
 * Created On Sun Aug 27 2023
 * 2023 Design at Yale
 *
 * Use this file as an example for how to best use SVG's throughout your app.
 * Copy paste the contents of an SVG into JSX and prop spread through any props
 * to the top-level <svg /> element:
 *  1. Remove the width and height HTML attributes from the <svg />
 *  2. Prop spread down into the SVG
 *  3. Add a <title> to the SVG for accessibility
 *  4. (optionally) Replace fills and strokes with currentColor for adaptive coloring.
 * You should now have a great SVG to use across your app.
 */

import { SVGProps } from "react";

export default function YAMLogo({
  disableTitle,
  ...props
}: SVGProps<SVGSVGElement> & { disableTitle?: boolean }) {
  return (
    <svg
      viewBox="0 0 727 297"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>YAM</title>
      <circle cx="400.5" cy="36.5" r="36.5" fill="currentColor" />
      <circle cx="585" cy="38" r="38" fill="currentColor" />
      <path
        d="M240.673 0.112285L125.819 296.999H49.0363L94.4942 185.415L0.529339 0.111938H73.5586L125.819 129.421L170.459 0.112285H240.673ZM364.496 235.971H255.254L234.733 296.999H169.953L275.775 0.112285H345.786L450.804 296.999H383.609L364.496 235.971ZM347.195 184.811L310.177 67.9894L271.952 184.811H347.195ZM497.977 296.999H440.236V0.112285H530.366L584.283 233.553L637.796 0.112285H726.921V296.999H669.184V96.1879C669.184 90.4137 669.25 82.3572 669.382 72.0179C669.518 61.5441 669.584 53.4875 669.584 47.8478L613.454 296.999H553.303L497.573 47.8478C497.573 53.4875 497.639 61.5441 497.775 72.0179C497.911 82.3572 497.977 90.4137 497.977 96.1879V296.999Z"
        fill="currentColor"
      />
    </svg>
  );
}
