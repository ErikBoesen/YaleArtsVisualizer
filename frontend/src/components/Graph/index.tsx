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
import { debounce } from "debounce";
import { fetcher } from "@/util/swr";
import { useAtomValue } from 'jotai';
import { dataSourceAtom } from '@/app/state';

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
  const { data: graphData } = useSWR(dataPath, fetcher);

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
        // nodeCanvasObject={}
        // enableZoomInteraction={false}
        // enablePanInteraction={false}
        graphData={graphData || { nodes: [], links: [] }}
      />
    </section>
  );
}
