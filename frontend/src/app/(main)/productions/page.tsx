/*
 * page.tsx
 * Author: evan kirkiles
 * Created on: Sat Oct 28 2023
 * 2023 Yale SWE
 */
import Link from "next/link";
import { prisma } from "@/util/prisma";

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
            <Link href={`/productions/${production.id}`}>
              {production.title}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
