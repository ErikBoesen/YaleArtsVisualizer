/*
 * route.tsx
 * Author: evan kirkiles
 * Created on: Mon Oct 30 2023
 * 2023 Yale SWE
 */

import {
  generateSelectStatement,
  parseNodesAndLinks,
} from "@/app/api/graph/utils";
import { prisma } from "@/util/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    personId: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { personId } = params;

  // Parse query graph depth (k) from params, default is 1
  const { searchParams } = req.nextUrl;
  const depth = parseInt(searchParams.get("depth") || "1");

  // Fetch the data from the graph
  const select = generateSelectStatement("persons", depth);
  const result = await prisma.person.findFirst({
    where: { id: parseInt(personId) },
    select,
  });
  if (!result)
    return NextResponse.json(
      { success: false, message: "Person not found." },
      { status: 404 }
    );

  // Flatten the structure to return it as nodes/links
  const { nodes, links } = parseNodesAndLinks(result);
  return NextResponse.json({ nodes, links });
}
