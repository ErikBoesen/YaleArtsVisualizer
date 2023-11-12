/*
 * index.tsx
 * Author: Evan Kirkiles
 * Created on: Fri Oct 27 2023
 * 2023 Yale SWE
 */
"use client";

import { useRef } from "react";
import s from "./Graph.module.scss";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { debounce } from "debounce";
import { useAtom, useAtomValue } from "jotai";
import { anchoredNodeAtom, dataSourceAtom, hoveredNodeAtom } from "@/app/state";
import { useGraphQuery } from "@/util/query";
import { useRouter } from "next/navigation";
// import NodeLabel
import NodeLabel from "@/components/NodeLabel";
import GraphOverlay from "@/components/Graph/GraphOverlay";
import useGraphDimensions from "@/components/Graph/hooks/useGraphDimensions";
import useConnects from "@/components/Graph/hooks/useConnectedNodes";
import useGraphInformation from "@/components/Graph/hooks/useGraphInformation";

/**
 * The Graph component consumes serialized queries from the GraphProvider, turns
 * them into actual queries against our backend, fetches them, and renders their
 * data in the commonly-shared top-level graph (on pages where it is relevant).
 */
export default function Graph() {
  // router for manually going to diff pages
  const router = useRouter();

  // fetch data for existing query
  const dataPath = useAtomValue(dataSourceAtom);
  const { data: graphData, isLoading } = useGraphQuery(...dataPath);
  const counts = useGraphInformation(graphData);

  // an imperative handle for modifying the force graph instance
  const graphRef = useRef<ForceGraphMethods<any, any> | undefined>(undefined);

  // synchronize graph dimensions with its container
  const containerRef = useRef<HTMLDivElement>(null);
  const { dimensions } = useGraphDimensions(containerRef, graphRef, graphData);

  // keep track of nodes connected to the anchored and hovered nodes
  const [anchoredNodeId, setAnchoredNode] = useAtom(anchoredNodeAtom);
  const [hoveredNodeId, setHoveredNodeId] = useAtom(hoveredNodeAtom);
  const anchorConnects = useConnects(anchoredNodeId, graphRef, graphData, true);
  const hoverConnects = useConnects(hoveredNodeId, graphRef, graphData);

  /* -------------------------------------------------------------------------- */
  /*                          For highlighting nodes                         */
  /* -------------------------------------------------------------------------- */

  // Current colors based on: https://coolors.co/palette/011f5b-003262-0f4d92-2774ae-b9d9eb-faebd7-f58025-a51c30-8c1515-800000
  const BASE_NODE_COLOR = "#0f4d92";
  const NODE_2_COLOR = "#FFFFFF";
  const BASE_LINK_COLOR = "#003262";
  const HIGHLIGHT_NODE_COLOR = "#a51c30";
  const HIGHLIGHT_ADJACENT_NODE_COLOR = "#DB5252";
  const HIGHLIGHT_LINK_COLOR = "#8c1515";

  const DEFAULT_LINE_WIDTH = 1;
  const HIGHLIGHT_LINE_WIDTH = 2;
  const NODE_RADIUS = 5;
  const BORDER_WIDTH = 2;
  const ANCHORED_NODE_RADIUS = 10;
  const ANCHORED_BORDER_WIDTH = 5;

  function renderNode(
    node: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) {
    // Draw the node
    const nodeRadius = NODE_RADIUS * node.val;
    const nodeColor = node._type === "person" ? BASE_NODE_COLOR : NODE_2_COLOR;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor || BASE_NODE_COLOR;
    ctx.fill();

    let borderWidth = 0.5;
    let borderColor = "#00356B20";
    if (
      node.id === hoveredNodeId ||
      node.id === anchoredNodeId ||
      hoverConnects.current.nodes.has(node.id) ||
      anchorConnects.current.nodes.has(node.id)
    ) {
      borderWidth = BORDER_WIDTH;
      borderColor =
        node.id === hoveredNodeId || node.id === anchoredNodeId
          ? HIGHLIGHT_NODE_COLOR
          : HIGHLIGHT_ADJACENT_NODE_COLOR;
    }

    // Draw border
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }

  function renderAnchoredNode(
    node: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) {
    // Draw the node
    const nodeRadius = ANCHORED_NODE_RADIUS * node.val;
    const nodeColor = node._type === "person" ? BASE_NODE_COLOR : NODE_2_COLOR;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor || BASE_NODE_COLOR;
    ctx.fill();

    // Draw border
    if (
      node.id === hoveredNodeId ||
      node.id === anchoredNodeId ||
      hoverConnects.current.nodes.has(node.id) ||
      anchorConnects.current.nodes.has(node.id)
    ) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
      // TODO: decide if we wanna use the highlight adjacent color or reg
      ctx.strokeStyle = HIGHLIGHT_ADJACENT_NODE_COLOR;
      ctx.lineWidth = ANCHORED_BORDER_WIDTH;
      ctx.stroke();
    }
  }

  function renderLink(
    link: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) {
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    const isConnected =
      hoverConnects.current.links.has(link.id) ||
      anchorConnects.current.links.has(link.id);
    ctx.strokeStyle = isConnected
      ? HIGHLIGHT_LINK_COLOR
      : link.color || BASE_LINK_COLOR;
    ctx.lineWidth = isConnected ? HIGHLIGHT_LINE_WIDTH : DEFAULT_LINE_WIDTH;

    ctx.stroke();
  }

  function renderAnchoredNodeLabelOnly(
    node: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) {
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      node.name.toUpperCase(),
      node.x,
      node.y + ANCHORED_BORDER_WIDTH + ANCHORED_NODE_RADIUS * 3
    );
  }

  return (
    <section
      className={s.container}
      ref={containerRef}
      suppressHydrationWarning
    >
      <ForceGraph2D
        nodeId="id"
        nodeColor="color"
        linkColor="color"
        ref={graphRef}
        // TODO: wrap text depending on length
        nodeLabel={(node) => (node.id === anchoredNodeId ? "" : node.name)}
        // values are already parsed depending on type. we should simplify this process to handle types ONLY in util.ts
        // the only thing going on this function should be the anchored node.
        nodeVal={(node) => {
          if (node.id === anchoredNodeId) {
            return 30;
          } else if (node._type === "person") {
            return 1.57;
          } else if (node._type === "production") {
            return 6.2;
          } else {
            return 0;
          }
        }}
        {...dimensions}
        minZoom={1}
        maxZoom={8}
        onNodeHover={(node) => {
          document.body.style.cursor = node ? "pointer" : "";
          setHoveredNodeId(node?.id);
          // setHoveredNodePosition({ x: node?.x, y: node?.y });
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (node.id === anchoredNodeId) {
            renderAnchoredNode(node, ctx, globalScale);
          } else {
            renderNode(node, ctx, globalScale);
          }

          // Always render the anchored node label last
          if (anchoredNodeId && graphData) {
            const anchoredNode = graphData.nodes.find(
              (n) => n.id === anchoredNodeId
            );
            if (anchoredNode) {
              renderAnchoredNodeLabelOnly(anchoredNode, ctx, globalScale);
            }
          }
        }}
        linkCanvasObject={(link, ctx, globalScale) =>
          renderLink(link, ctx, globalScale)
        }
        onNodeClick={(node) => {
          setAnchoredNode(node.id);
          const nodePath =
            node._type === "production" ? "productions" : "people";
          const nodeId = (node.id as string)
            .replace("prod_", "")
            .replace("pers_", "");
          router.push(`/${nodePath}/${nodeId}`);
        }}
        linkHoverPrecision={10}
        graphData={graphData || { nodes: [], links: [] }}
      />
      <GraphOverlay containerRef={containerRef} graphRef={graphRef}>
        <h1>Showing THE NODE NAME</h1>
        <div>
          {counts &&
            `${counts.production} productions, ${counts.person} people`}
        </div>
      </GraphOverlay>

      {/* {hoveredNodeId && (
        <NodeLabel
          name={hoveredNodeId}
          position={hoveredNodePosition}
          graphRef={graphRef}
        />
      )} */}
    </section>
  );
}
