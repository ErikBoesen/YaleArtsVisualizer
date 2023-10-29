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
    });
  } catch (e) {
    notFound();
  }

  return (
    <article>
      PRODUCTION:
      <h1>{production.title}</h1>
      {/* <GraphData source="/api/people/a" /> */}
    </article>
  );
}
