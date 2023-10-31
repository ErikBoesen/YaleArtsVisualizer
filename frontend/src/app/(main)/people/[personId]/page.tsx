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

  return (
    <article>
      PERSON:
      <h1>{person.name}</h1>
      <ul>
        {person.productions.map(({ id, production }) => (
          <li key={id}>
            <Link href={`/productions/${production.id}`}>
              {production.name}
            </Link>
          </li>
        ))}
      </ul>
      <GraphData source={["people", person.id, { depth: "4" }]} />
    </article>
  );
}
