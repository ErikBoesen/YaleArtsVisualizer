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
import useSWR from "swr";
import { fetcher } from "@/util/swr";

/**
 * The Graph component consumes serialized queries from the GraphProvider, turns
 * them into actual queries against our backend, fetches them, and renders their
 * data in the commonly-shared top-level graph (on pages where it is relevant).
 */
export default function Graph() {
  const graphRef = useRef<ForceGraphMethods<any, any> | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // fetch data for existing query
  const { data } = useSWR("/ydn_graph.json", fetcher);

  return (
    <section className={s.container} suppressHydrationWarning>
      {typeof window !== "undefined" && mounted && (
        <ForceGraph2D
          nodeId="id"
          nodeColor="color"
          linkColor="color"
          ref={graphRef}
          // enableZoomInteraction={false}
          // enablePanInteraction={false}
          graphData={data || { nodes: [], links: [] }}
        />
      )}
    </section>
  );
}
