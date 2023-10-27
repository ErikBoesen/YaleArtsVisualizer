/*
 * index.tsx
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 */

import YAMLogo from "@/assets/svg/YAMLogo";
import s from "./Header.module.scss";
import Link from "next/link";

export default function Header() {
  return (
    <header className={s.container}>
      <Link href="/" className={s.logo}>
        <YAMLogo />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/explore">Explore</Link>
          </li>
          <li>
            <Link href="/">Search</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/help">Help</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
