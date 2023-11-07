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
import Balancer from "react-wrap-balancer";
import s from "../../SubPage.module.scss";
import NodeLink from "@/components/NodeLink";

interface RouteParams {
  params: {
    personId: string;
  };
}

export default async function PersonPage({
  params: { personId },
}: RouteParams) {
  try {
    const id = parseInt(personId);
    var person = await prisma.person.findFirstOrThrow({
      where: { id },
      include: {
        productions: {
          select: {
            id: true,
            role: true,
            group: true,
            production: {
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
    notFound();
  }

  const href = person.href ? new URL(person.href) : undefined;

  return (
    <article className={s.container}>
      <hgroup>
        <h1>
          <NodeLink nodeType="person" nodeId={person.id} style={{ opacity: 1 }}>
            <Balancer>{person.name}</Balancer>
          </NodeLink>
        </h1>
        {href && (
          <a href={href.href} target="_blank" rel="noopener noreferrer">
            Visit on {href.hostname} {"->"}
          </a>
        )}
      </hgroup>
      <pre>{person.description}</pre>
      <section>
        <h2>Productions</h2>
        <ul>
          {person.productions.map(({ id, production }) => (
            <li key={id}>
              <NodeLink nodeType="production" nodeId={production.id}>
                {production.name}
              </NodeLink>
            </li>
          ))}
        </ul>
      </section>
      <GraphData
        source={["people", person.id, { depth: "2" }]}
        anchoredNodeId={`pers_${person.id}`}
      />
    </article>
  );
}
