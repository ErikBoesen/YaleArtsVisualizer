/*
 * page.tsx
 * Author: evan kirkiles
 * Created on: Sat Oct 28 2023
 * 2023 Yale SWE
 */

import { prisma } from "@/util/prisma";
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
    var person = await prisma.person.findFirstOrThrow({ where: { id } });
  } catch (e) {
    notFound();
  }

  return (
    <article>
      PERSON:
      <h1>{person.name}</h1>
      {/* <GraphData source="/api/people/a" /> */}
    </article>
  );
}
