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
import { useAtom, useAtomValue } from "jotai";
import { anchoredNodeAtom, dataSourceAtom, hoveredNodeAtom } from "@/app/state";
import { useGraphQuery } from "@/util/query";
import { useRouter } from "next/navigation";

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
  // router for manually going to diff pages
  const router = useRouter();

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

  // When dimensions change, re-focus the data
  useEffect(() => {
    const { width } = dimensions;
    if (!width) return;
    graphRef.current?.zoomToFit(300, width * 0.05);
  }, [dimensions]);

  // Also focus the graph after new data loads
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      graphRef.current?.zoomToFit(300, width * 0.05);
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [graphData]);

  // When anchored node changes, update its position in the nodes array
  const [anchoredNodeId, setAnchoredNode] = useAtom(anchoredNodeAtom);
  const anchorConnects = useRef({ nodes: new Set(), links: new Set() });
  useEffect(() => {
    if (!graphData) return;
    graphData.nodes.forEach((node) => {
      if (node.id === anchoredNodeId) {
        node.fx = node.x;
        node.fy = node.y;
        graphRef.current?.centerAt(node.x, node.y, 300);
      } else {
        node.fx = undefined;
        node.fy = undefined;
      }
    });
    const { nodes, links } = anchorConnects.current;
    nodes.clear();
    links.clear();
    if (anchoredNodeId) {
      graphData.links.forEach((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;
        if (sourceId === anchoredNodeId) {
          nodes.add(targetId);
          links.add(link.id);
        } else if (targetId === anchoredNodeId) {
          nodes.add(sourceId);
          links.add(link.id);
        }
      });
    }
  }, [anchoredNodeId, graphData]);

  // Custom node appearance with the project's logo
  const logoImage = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = "/YAMLogo.png";
    img.onload = () => {
      logoImage.current = img;
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                          For highlighting nodes                         */
  /* -------------------------------------------------------------------------- */

  // Current colors based on: https://coolors.co/palette/011f5b-003262-0f4d92-2774ae-b9d9eb-faebd7-f58025-a51c30-8c1515-800000
  const BASE_NODE_COLOR = "#0f4d92";
  const NODE_2_COLOR = "#ffffff";
  const BASE_LINK_COLOR = "#003262";
  const HIGHLIGHT_NODE_COLOR = "#a51c30";
  const HIGHLIGHT_ADJACENT_NODE_COLOR = "#DB5252";
  const HIGHLIGHT_LINK_COLOR = "#8c1515";

  // State to keep track of hovered node
  const [hoveredNodeId, setHoveredNodeId] = useAtom(hoveredNodeAtom);
  const connections = useRef({ nodes: new Set(), links: new Set() });
  // update connections ref every time graphdata or hovered node changes
  useEffect(() => {
    if (!graphData) return;
    const { nodes, links } = connections.current;
    nodes.clear();
    links.clear();
    if (hoveredNodeId) {
      graphData.links.forEach((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;
        if (sourceId === hoveredNodeId) {
          nodes.add(targetId);
          links.add(link.id);
        } else if (targetId === hoveredNodeId) {
          nodes.add(sourceId);
          links.add(link.id);
        }
      });
    }
  }, [hoveredNodeId, graphData]);

  function renderNode(
    node: any,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) {
    const NODE_RADIUS = 5;
    const BORDER_WIDTH = 2;
    const highlightColor = HIGHLIGHT_NODE_COLOR;
    const connectedColor = HIGHLIGHT_ADJACENT_NODE_COLOR;

    // Draw the node
    const nodeRadius = NODE_RADIUS * node.val;
    const nodeColor = node._type === "person" ? BASE_NODE_COLOR : NODE_2_COLOR;
    ctx.beginPath();

    if (node._type === "logo" && logoImage.current) {
      const width = logoImage.current.naturalWidth / 25;
      const height = logoImage.current.naturalHeight / 25;
      ctx.drawImage(
        logoImage.current,
        node.x - width / 2,
        node.y - height / 2,
        width,
        height
      );
    } else if (node._type === "banner") {
      ctx.ellipse(
        node.x,
        node.y,
        nodeRadius * 1.7,
        nodeRadius,
        0,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "#00356b";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.3;
      ctx.stroke();
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.fillText(node.name, node.x, node.y);
    } else if (node._type === "hollow") {
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#00356b";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = nodeColor || BASE_NODE_COLOR;
      ctx.fill();
    }

    // Draw border if necessary
    if (
      node._type !== "logo" &&
      node._type !== "crew" &&
      node._type !== "banner" &&
      node._type !== "hollow"
    ) {
      if (
        node.id === hoveredNodeId ||
        node.id === anchoredNodeId ||
        connections.current.nodes.has(node.id) ||
        anchorConnects.current.nodes.has(node.id)
      ) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
        ctx.strokeStyle =
          node.id === hoveredNodeId || node.id === anchoredNodeId
            ? highlightColor
            : connectedColor;
        ctx.lineWidth = BORDER_WIDTH;
        ctx.stroke();
      }
    }
    if (node._type === "crew") {
      const labelFontSize = 2.5;
      ctx.font = `${labelFontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.fillText(node.name, node.x, node.y - nodeRadius - labelFontSize / 2);
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
    const isConnected =
      connections.current.links.has(link.id) ||
      anchorConnects.current.links.has(link.id);
    ctx.strokeStyle = isConnected
      ? highlightColor
      : link.color || BASE_LINK_COLOR;
    ctx.lineWidth = isConnected ? HIGHLIGHT_LINE_WIDTH : DEFAULT_LINE_WIDTH;

    if (link.source._type === "logo" || link.source._type === "crew") {
      ctx.strokeStyle = BASE_LINK_COLOR;
      ctx.lineWidth = DEFAULT_LINE_WIDTH;
    } else if (
      link.source._type === "banner" &&
      link.target._type === "banner"
    ) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.75;
    } else if (
      link.source._type === "hollow" ||
      link.target._type === "hollow"
    ) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.25;
    }
    ctx.stroke();
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
        {...dimensions}
        onNodeHover={(node) => {
          document.body.style.cursor = node ? "pointer" : "";
          setHoveredNodeId(node?.id);
        }}
        nodeCanvasObject={(node, ctx, globalScale) =>
          renderNode(node, ctx, globalScale)
        }
        linkCanvasObject={(link, ctx, globalScale) =>
          renderLink(link, ctx, globalScale)
        }
        onNodeClick={(node) => {
          if (
            node._type !== "logo" &&
            node._type !== "crew" &&
            node._type !== "banner" &&
            node._type !== "hollow"
          ) {
            setAnchoredNode(node.id);
            const nodePath =
              node._type === "production" ? "productions" : "people";
            const nodeId = (node.id as string)
              .replace("prod_", "")
              .replace("pers_", "");
            router.push(`/${nodePath}/${nodeId}`);
          }
        }}
        linkHoverPrecision={10}
        graphData={graphData || { nodes: [], links: [] }}
      />
    </section>
  );
}
