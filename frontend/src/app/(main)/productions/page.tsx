/*
 * page.tsx
 * Author: evan kirkiles
 * Created on: Sat Oct 28 2023
 * 2023 Yale SWE
 */
import { prisma } from "@/util/prisma";
import GraphData from "@/components/Graph/GraphData";
import NodeLink from "@/components/NodeLink";

// revalidate every hour
export const revalidate = 3600;

export default async function ProductionsPage() {
  const productions = await prisma.production.findMany({});

  return (
    <article>
      <h1>Productions</h1>
      <ul>
        {productions.map((production) => (
          <li key={production.id}>
            <NodeLink nodeType="production" nodeId={production.id}>
              {production.name}
            </NodeLink>
          </li>
        ))}
      </ul>
      <GraphData source={["productions", undefined, { depth: "2" }]} />
    </article>
  );
}
