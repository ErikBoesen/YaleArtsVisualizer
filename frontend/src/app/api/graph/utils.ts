/*
 * utils.ts
 * Author: evan kirkiles
 * Created on: Mon Oct 30 2023
 * 2023 Yale SWE
 */

import { ProductionPersonEdge } from "@prisma/client";
import { LinkObject, NodeObject } from "react-force-graph-2d";

const SELECTS = {
  productions: {
    nextEdge: "persons",
    nextNode: "person",
    select: {
      _type: true,
      id: true,
      name: true,
      organizationId: true,
    },
  },
  persons: {
    nextEdge: "productions",
    nextNode: "production",
    select: {
      _type: true,
      id: true,
      name: true,
    },
  },
} as const;

/**
 * Generates a k-nested select statement for a specific NodeType (Production or
 * Person).
 *
 * @param nodeType
 * @param depth
 * @returns
 */
export function generateSelectStatement(
  nodeType: "productions" | "persons",
  k = 1
) {
  const selector = { ...SELECTS[nodeType].select };
  let currIter = selector;
  if (k === 0) return selector;
  while (k > 0) {
    const { nextEdge, nextNode } = SELECTS[nodeType];
    const newSelector = {
      select: {
        _type: true,
        id: true,
        role: true,
        group: true,
        productionId: true,
        personId: true,
        [nextNode]: {
          select: {
            ...SELECTS[nextEdge].select,
          },
        },
      },
    };
    // @ts-ignore (Typing not worth the effort here)
    currIter[nextEdge] = newSelector;
    // @ts-ignore
    currIter = newSelector.select[nextNode].select;
    k -= 1;
    nodeType = nextEdge;
  }
  return selector;
}

/**
 * Parses
 */
export function parseNodesAndLinks<T extends { _type: string }>(
  rootNode: T
  // | (Person & { _type: "person"; productions: ProductionPersonEdge[] })
  // | (Production & { _type: "production"; people: ProductionPersonEdge[] })
) {
  const nodes: { [key: string]: NodeObject } = {};
  const links: LinkObject[] = [];
  let toParse: any[] = [rootNode];
  while (toParse.length > 0) {
    const parsable = toParse.pop();
    if (!parsable) continue;
    switch (parsable._type) {
      case "person":
        toParse.push(...(parsable.productions || []));
        delete parsable["productions"];
        parsable.id = `pers_${parsable.id}`;
        parsable.val = 1; // this is the size of the node
        nodes[parsable.id] = parsable;
        break;
      case "production":
        toParse.push(...((parsable.persons || []) as unknown as T[]));
        delete parsable["persons"];
        parsable.id = `prod_${parsable.id}`;
        parsable.val = 2; // this is the size of the node
        nodes[parsable.id] = parsable;
        break;
      case "productionpersonedge":
        toParse.push(parsable.production as unknown as T);
        toParse.push(parsable.person as unknown as T);
        delete parsable["production"];
        delete parsable["person"];
        links.push({
          ...parsable,
          source: `prod_${(parsable as ProductionPersonEdge).productionId}`,
          target: `pers_${(parsable as ProductionPersonEdge).personId}`,
        });
        break;
    }
  }

  return { nodes: Object.values(nodes), links };
}
