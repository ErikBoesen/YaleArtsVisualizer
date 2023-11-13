/*
 * swr.ts
 * Author: Evan Kirkiles
 * Created on: Fri Oct 27 2023
 * 2023 Yale SWE
 */

import { NodeEndpoint } from "@/app/api/graph/utils";
import { GraphData } from "react-force-graph-2d";
import AboutGraphData from "./AboutGraphData.json";
import HomeGraphData from "./HomeGraphData.json";
import { QueryClient, useQuery } from "react-query";

type NodeFetchId = number;
type NodeFetchOptions = {
  depth?: string;
};

export type NodeQueryKey =
  | [NodeEndpoint]
  | [NodeEndpoint, NodeFetchId]
  | [NodeEndpoint, NodeFetchId | undefined, NodeFetchOptions]
  | ["static", "about" | "home"];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export function useGraphQuery(...args: NodeQueryKey) {
  return useQuery<GraphData, unknown, GraphData, NodeQueryKey>({
    queryKey: args,
    keepPreviousData: true,
    queryFn: async ({ queryKey }) => {
      const [nodeType, nodeId, nodeOptions] = queryKey;
      if (nodeType === "static") {
        switch (nodeId) {
          case "about":
            return AboutGraphData;
          case "home":
            return HomeGraphData;
          default:
            throw new Error("Unknown static graph type");
        }
      }
      let fetchUrl = `/api/graph/${nodeType}`;
      if (nodeId) fetchUrl += `/${nodeId}`;
      // TODO: Add filtering so we can reliably fetch / search all nodes.
      else {
        return { nodes: [], links: [] };
      }
      if (nodeOptions) {
        fetchUrl += `?${new URLSearchParams(nodeOptions).toString()}`;
      }
      return fetch(fetchUrl).then((r) => r.json());
    },
  });
}
