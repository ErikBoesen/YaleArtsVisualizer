/*
 * page.tsx
 * Authors: Evan Kirkiles, Misho Gabashvili
 * Created on: Fri Oct 27 2023
 * 2023 Yale SWE
 */
import Link from "next/link";
import s from "./About.module.scss";
import GraphData from "@/components/Graph/GraphData";

export default function AboutPage() {
  return (
    <article className={s.aboutPageContainer}>
      <h1>About Yale Arts Map</h1>
      {/* <GraphData source="/ydn_graph.json" /> */}

      <section className={s.descriptionContainer}>
        <section className={s.aboutArtsMap}>
          <p>
            The Yale Arts Map is a visual tool for exploring the interconnected
            Yale arts community, including theater, film, and journalism. It
            displays the network of collaborations and projects, offers insights
            into clusters of collaborators, and includes advanced features to
            uncover relationships within the university's vibrant artistic
            landscape.
          </p>
        </section>

        <section className={s.crewSection}>
          <h2>Crew</h2>
          <ul>
            <li>Dom Hanson</li>
            <li>Erik Boesen</li>
            <li>Evan Kirkiles</li>
            <li>Fernando Cuello-Garcia</li>
            <li>Misho Gabashvili</li>
          </ul>
        </section>
      </section>

      <section className={s.explore}>
        <h2 className={s.subsection_header}></h2>
        <nav aria-label="Secondary">
          <ul>
            <li>
              <Link href="/">1 - Motivation</Link>
            </li>
            <h2 className={s.subsection_header}></h2>
            <li>
              <Link href="/">2 – Planning</Link>
            </li>
            <h2 className={s.subsection_header}></h2>
            <li>
              <Link href="/">3 – Design</Link>
            </li>
            <h2 className={s.subsection_header}></h2>
            <li>
              <Link href="/">4 – Implementation</Link>
            </li>
            <h2 className={s.subsection_header}></h2>
          </ul>
        </nav>
      </section>
    </article>
  );
}
