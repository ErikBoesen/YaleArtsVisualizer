/*
 * page.tsx
 * Author: evan kirkiles
 * Created on: Sat Oct 28 2023
 * 2023 Yale SWE
 */
import GraphData from "@/components/Graph/GraphData";
import NodeLink from "@/components/NodeLink";
import { prisma } from "@/util/prisma";
import Link from "next/link";

export const revalidate = false;

export default async function PeoplePage() {
  const people = await prisma.person.findMany();

  return (
    <article>
      <h1>People</h1>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <NodeLink nodeType="person" nodeId={person.id}>
              {person.name}
            </NodeLink>
          </li>
        ))}
      </ul>
      <GraphData source={["people", undefined, { depth: "2" }]} />
    </article>
  );
}
