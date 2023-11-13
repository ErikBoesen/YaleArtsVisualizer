/*
 * page.tsx
 * Author: Evan Kirkiles
 * Created on: Thu Oct 26 2023
 * 2023 Yale SWE
 */
import Link from "next/link";
import s from "./Home.module.scss";
import GraphData from "@/components/Graph/GraphData";

export default function Page() {
  return (
    <article className={s.container}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Cursus euismod quis
        viverra nibh cras pulvinar mattis nunc. Feugiat vivamus at augue eget
        arcu dictum. Eu facilisis sed odio morbi quis commodo odio. Iaculis nunc
        sed augue lacus viverra vitae congue eu consequat. Cursus euismod quis
        viverra nibh cras pulvinar mattis nunc sed. Volutpat ac tincidunt vitae
        semper. Lacinia quis vel eros donec ac odio tempor orci. Adipiscing diam
        donec adipiscing tristique risus nec feugiat in. Tempus urna et pharetra
        pharetra massa massa. Mattis aliquam faucibus purus in massa tempor nec
        feugiat nisl. Nibh tortor id aliquet lectus proin nibh. Id faucibus nisl
        tincidunt eget.
      </p>
      <section className={s.immediate_explore}>
        <h2 className={s.subsection_header}>Get Started</h2>
        <nav aria-label="Secondary">
          <ul>
            <li>
              <Link href="/">School of Art {"->"}</Link>
            </li>
            <li>
              <Link href="/">Yale Daily News {"->"}</Link>
            </li>
            <li>
              <Link href="/">Performing Arts {"->"}</Link>
            </li>
          </ul>
        </nav>
      </section>
    </article>
  );
}
