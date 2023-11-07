/*
 * page.tsx
 * Author: evan kirkiles
 * Created on: Sat Oct 28 2023
 * 2023 Yale SWE
 */

import GraphData from "@/components/Graph/GraphData";
import { prisma } from "@/util/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import s from "../../SubPage.module.scss";
import { Fragment } from "react";
import Balancer from "react-wrap-balancer";

interface RouteParams {
  params: {
    productionId: string;
  };
}

export default async function ProductionPage({
  params: { productionId },
}: RouteParams) {
  try {
    const id = parseInt(productionId);
    var production = await prisma.production.findFirstOrThrow({
      where: { id },
      include: {
        persons: {
          select: {
            id: true,
            role: true,
            group: true,
            person: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (e) {
    console.error(e);
    notFound();
  }

  const href = new URL(production.href);
  const groups = Object.entries(
    production.persons.reduce(
      (acc, curr) => {
        const group = curr.group || "";
        if (!acc[group]) acc[group] = [];
        acc[group].push(curr);
        return acc;
      },
      {} as { [key: string]: (typeof production)["persons"] }
    )
  );

  return (
    <article className={s.container}>
      <hgroup>
        <h1>
          <Balancer>{production.name}</Balancer>
        </h1>

        <a href={production.href} target="_blank" rel="noopener noreferrer">
          Visit on {href.hostname} {"->"}
        </a>
      </hgroup>
      <pre>{production.description}</pre>
      <section>
        <h2>Cast</h2>
        <table>
          <thead>
            {/* <tr>
              <th>Role</th>
              <th>Person</th>
            </tr> */}
          </thead>
          <tbody>
            {groups.map(([group, edges], index) => (
              <Fragment key={group}>
                {/* {group !== "" && <h3>{group}</h3>} */}
                <tr>
                  <td className={s.group_label} colSpan={2}>
                    {group}
                  </td>
                </tr>
                {/* <ul> */}
                {edges.map(({ id, person, role }) => (
                  <tr key={id}>
                    <td>{role}</td>
                    <td>
                      <Link href={`/people/${person.id}`}>{person.name}</Link>
                    </td>
                    {/* <br /> */}
                  </tr>
                ))}
                {/* </ul> */}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
      <GraphData source={["productions", production.id, { depth: "3" }]} />
    </article>
  );
}
