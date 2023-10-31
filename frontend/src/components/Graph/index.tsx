/*
 * index.tsx
 * Author: Evan Kirkiles
 * Created on: Fri Oct 27 2023
 * 2023 Yale SWE
 */
"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Graph.module.scss";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { debounce } from "debounce";
import { useAtomValue } from "jotai";
import { dataSourceAtom } from "@/app/state";
import { useGraphQuery } from "@/util/query";

interface Dimensions {
  width?: number;
  height?: number;
}

/**
 * The Graph component consumes serialized queries from the GraphProvider, turns
 * them into actual queries against our backend, fetches them, and renders their
 * data in the commonly-shared top-level graph (on pages where it is relevant).
 */
export default function Graph() {
  // fetch data for existing query
  const dataPath = useAtomValue(dataSourceAtom);
  const { data: graphData, isLoading } = useGraphQuery(...dataPath);

  // an imperative handle for modifying the force graph instance
  const graphRef = useRef<ForceGraphMethods<any, any> | undefined>(undefined);

  // the below resizes the dimensions state based on the size of the container
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({});
  useEffect(() => {
    if (!containerRef.current) return;
    const listener: ResizeObserverCallback = debounce(([{ contentRect }]) => {
      const { width, height } = contentRect;
      setDimensions({ width, height });
    }, 100);
    const observer = new ResizeObserver(listener);
    observer.observe(containerRef.current, { box: "content-box" });
    return () => observer.disconnect();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                          For highlighting nodes                         */
  /* -------------------------------------------------------------------------- */

  // Current colors based on: https://coolors.co/palette/011f5b-003262-0f4d92-2774ae-b9d9eb-faebd7-f58025-a51c30-8c1515-800000
  const BASE_NODE_COLOR = "#0f4d92";
  const NODE_2_COLOR = "#ffffff";
  const BASE_LINK_COLOR = "#003262";
  const HIGHLIGHT_NODE_COLOR = "#a51c30";
  const HIGHLIGHT_ADJACENT_NODE_COLOR = "#f58025";
  const HIGHLIGHT_LINK_COLOR = "#8c1515";

  // State to keep track of hovered node
  const [hoveredNode, setHoveredNode] = useState(null);
  // State to keep track of connected nodes and links
  const [connectedNodes, setConnectedNodes] = useState<Set<any>>(new Set());
  const [connectedLinks, setConnectedLinks] = useState<Set<any>>(new Set());

  function determineConnectedElements(node: any) {
    if (!graphData) return;

    const nodes = new Set();
    const links = new Set();

    if (node) {
      graphData.links.forEach((link: any) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;

        if (sourceId === node.id) {
          nodes.add(targetId);
          links.add(link);
        } else if (targetId === node.id) {
          nodes.add(sourceId);
          links.add(link);
        }
      });
    }

    setConnectedNodes(nodes);
    setConnectedLinks(links);
  }

  function handleNodeHover(node: any) {
    if (node) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "";
    }
    setHoveredNode(node);
    determineConnectedElements(node);
  }

  function renderNode(
    node: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
    hoveredNode: any
  ) {
    const NODE_RADIUS = 5;
    const BORDER_WIDTH = 2;
    const highlightColor = HIGHLIGHT_NODE_COLOR;
    const connectedColor = HIGHLIGHT_ADJACENT_NODE_COLOR;

    // Draw the node
    const nodeRadius = NODE_RADIUS * node.val;
    const nodeColor = node._type === "person" ? BASE_NODE_COLOR : NODE_2_COLOR;
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor || BASE_NODE_COLOR;
    ctx.fill();

    // Draw border if necessary
    if (node === hoveredNode || connectedNodes.has(node.id)) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
      ctx.strokeStyle = node === hoveredNode ? highlightColor : connectedColor;
      ctx.lineWidth = BORDER_WIDTH;
      ctx.stroke();
    }
  }

  function renderLink(
    link: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) {
    const DEFAULT_LINE_WIDTH = 1;
    const HIGHLIGHT_LINE_WIDTH = 2;
    const highlightColor = HIGHLIGHT_LINK_COLOR;

    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.strokeStyle = connectedLinks.has(link)
      ? highlightColor
      : link.color || BASE_LINK_COLOR;
    ctx.lineWidth = connectedLinks.has(link)
      ? HIGHLIGHT_LINE_WIDTH
      : DEFAULT_LINE_WIDTH;

    ctx.stroke();
  }

  console.log(graphData);

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
        {...dimensions}
        onNodeHover={handleNodeHover}
        nodeCanvasObject={(node, ctx, globalScale) =>
          renderNode(node, ctx, globalScale, hoveredNode)
        }
        linkCanvasObject={(link, ctx, globalScale) =>
          renderLink(link, ctx, globalScale)
        }
        linkHoverPrecision={10}
        // nodeRelSize={5}
        cooldownTicks={100}
        onEngineStop={() => {
          if (!containerRef.current) return;
          const { width } = containerRef.current.getBoundingClientRect();
          graphRef.current?.zoomToFit(300, width * 0.05);
        }}
        graphData={graphData || { nodes: [], links: [] }}
      />
    </section>
  );
}
