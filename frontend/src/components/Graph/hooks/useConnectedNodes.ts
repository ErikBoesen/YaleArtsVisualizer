/* eslint-disable react-hooks/exhaustive-deps */
/*
 * useConnectedNodes.ts
 * author: evan kirkiles
 * created on Fri Nov 10 2023
 * 2023 the nobot space
 */
import { RefObject, useEffect, useRef } from "react";
import { ForceGraphMethods, GraphData } from "react-force-graph-2d";

export default function useConnects(
  nodeId: string | undefined,
  graphRef: RefObject<ForceGraphMethods<any, any> | undefined>,
  graphData: GraphData<{}, {}> | undefined,
  centered?: boolean
) {
  const nodeConnects = useRef({ nodes: new Set(), links: new Set() });
  useEffect(() => {
    if (!graphData) return;
    if (centered) {
      graphData.nodes.forEach((node) => {
        if (node.id === nodeId) {
          node.fx = node.x;
          node.fy = node.y;
          graphRef.current?.centerAt(node.x, node.y, 300);
        } else {
          node.fx = undefined;
          node.fy = undefined;
        }
      });
    }
    const { nodes, links } = nodeConnects.current;
    nodes.clear();
    links.clear();
    if (nodeId) {
      graphData.links.forEach((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;
        if (sourceId === nodeId) {
          nodes.add(targetId);
          links.add(link.id);
        } else if (targetId === nodeId) {
          nodes.add(sourceId);
          links.add(link.id);
        }
      });
    }
  }, [nodeId, graphData]);

  return nodeConnects;
}
