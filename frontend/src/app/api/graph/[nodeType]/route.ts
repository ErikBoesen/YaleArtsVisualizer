/*
 * route.tsx
 * Author: evan kirkiles
 * Created on: Mon Oct 30 2023
 * 2023 Yale SWE
 */

import {
  ENDPOINT_TABLE_MAP,
  NodeEndpoint,
  generateSelectStatement,
  parseNodesAndLinks,
} from "@/app/api/graph/utils";
import { prisma } from "@/util/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    nodeType: NodeEndpoint;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  // Parse query graph depth (k) from params, default is 1
  const { nodeType } = params;
  const table = ENDPOINT_TABLE_MAP[nodeType];
  const { searchParams } = req.nextUrl;
  const depth = parseInt(searchParams.get("depth") || "1");

  // Fetch the data from the graph
  const select = generateSelectStatement(table, depth);
  const result = await prisma[table].findMany({
    select,
  });
  if (!result)
    return NextResponse.json(
      { success: false, message: "Production not found." },
      { status: 404 }
    );

  // Flatten the structure to return it as nodes/links
  const res = result.reduce(
    (
      acc: { nodes: { [key: string]: any }; links: { [key: string]: any } },
      pres: any
    ) => {
      const { nodes, links } = parseNodesAndLinks(pres);
      nodes.forEach((node) => {
        acc.nodes[node.id!] = node;
      });
      links.forEach((link) => {
        acc.links[link.id] = link;
      });
      return acc;
    },
    { nodes: {}, links: {} }
  );
  return NextResponse.json({
    nodes: Object.values(res.nodes),
    links: Object.values(res.links),
  });
}
