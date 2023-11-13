/* eslint-disable react-hooks/exhaustive-deps */
/*
 * useGraphDimensions.ts
 * author: evan kirkiles
 * created on Fri Nov 10 2023
 * 2023 Yale SWE
 */

import debounce from "debounce";
import { RefObject, useEffect, useState } from "react";
import { ForceGraphMethods, GraphData } from "react-force-graph-2d";

export interface Dimensions {
  width?: number;
  height?: number;
}

/**
 * Matches an internal dimensions state to the content box of the graph
 * container, allowing canvas resizing. Also handles focusing the graph after
 * a graph resize.
 */
export default function useGraphDimensionsAndFocus(
  containerRef: RefObject<HTMLDivElement>,
  graphRef: RefObject<ForceGraphMethods<any, any> | undefined>,
  graphData: GraphData<{}, {}> | undefined
) {
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

  return { dimensions };
}
