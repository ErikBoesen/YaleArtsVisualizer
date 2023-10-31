/*
 * swr.ts
 * Author: Evan Kirkiles
 * Created on: Fri Oct 27 2023
 * 2023 Yale SWE
 */

import { NodeEndpoint } from "@/app/api/graph/utils";
import { GraphData } from "react-force-graph-2d";
import { QueryClient, useQuery } from "react-query";

type NodeFetchId = number;
type NodeFetchOptions = {
  depth?: string;
};

export type NodeQueryKey =
  | [NodeEndpoint]
  | [NodeEndpoint, NodeFetchId]
  | [NodeEndpoint, NodeFetchId | undefined, NodeFetchOptions]
  | ["static", string];

export const queryClient = new QueryClient({});

export function useGraphQuery(...args: NodeQueryKey) {
  return useQuery<GraphData, unknown, GraphData, NodeQueryKey>({
    queryKey: args,
    keepPreviousData: true,
    queryFn: async ({ queryKey }) => {
      const [nodeType, nodeId, nodeOptions] = queryKey;
      let fetchUrl = `/api/graph/${nodeType}`;
      if (nodeId) fetchUrl += `/${nodeId}`;
      if (nodeOptions) {
        fetchUrl += `?${new URLSearchParams(nodeOptions).toString()}`;
      }
      return fetch(fetchUrl).then((r) => r.json());
    },
  });
}
