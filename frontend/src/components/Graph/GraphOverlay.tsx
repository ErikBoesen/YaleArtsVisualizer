/*
 * GraphOverlay.tsx
 * author: evan kirkiles
 * created on Fri Nov 10 2023
 * 2023 the nobot space
 */

import { PropsWithChildren, RefObject, useReducer, useState } from "react";
import { ForceGraphMethods } from "react-force-graph-2d";
import {
  MdOutlineFitScreen,
  MdOutlinePause,
  MdOutlinePlayArrow,
} from "react-icons/md";
import s from "./Graph.module.scss";

interface GraphOverlayProps extends PropsWithChildren {
  // name: string;
  // position: { x: number; y: number };
  containerRef: RefObject<HTMLDivElement>;
  graphRef: React.RefObject<ForceGraphMethods<any, any> | undefined>;
}

export default function GraphOverlay({
  children,
  containerRef,
  graphRef,
}: GraphOverlayProps) {
  const [paused, togglePaused] = useReducer((prev: boolean) => {
    if (prev) {
      graphRef.current?.resumeAnimation();
    } else {
      graphRef.current?.pauseAnimation();
    }
    return !prev;
  }, false);

  return (
    <div className={s.overlay} role="presentation">
      <div className={s.info}>{children}</div>
      <div className={s.controls}>
        <button
          onClick={() => {
            if (!containerRef.current) return;
            const { width } = containerRef.current.getBoundingClientRect();
            graphRef.current?.zoomToFit(300, width * 0.05);
          }}
        >
          <MdOutlineFitScreen />
        </button>
        <button
          role="checkbox"
          onClick={togglePaused}
          aria-label="Pause animation"
          aria-checked={paused}
        >
          {paused ? <MdOutlinePlayArrow /> : <MdOutlinePause />}
        </button>
      </div>
    </div>
  );
}
