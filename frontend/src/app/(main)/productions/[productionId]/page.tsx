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

  return (
    <article>
      PRODUCTION:
      <h1>{production.name}</h1>
      {production.persons.map(({ id, role, group, person }, index) => (
        <li key={id}>
          <Link href={`/people/${person.id}`}>{person.name}</Link>
        </li>
      ))}
      <GraphData source={["productions", production.id, { depth: "3" }]} />
    </article>
  );
}
