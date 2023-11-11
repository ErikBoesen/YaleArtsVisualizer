"use client";

// deprecated

import { useRef } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { ComponentProps, PropsWithChildren } from "react";

interface NodeLabelProps extends PropsWithChildren {
  name: string;
  position: { x: number; y: number };
  graphRef: React.RefObject<ForceGraphMethods<any, any> | undefined>;
}

const NodeLabel = ({ name, position, graphRef }: NodeLabelProps) => {
  let x = 0;
  let y = 0;

  // Check if graphRef.current is available and then convert coordinates
  if (graphRef.current) {
    const screenCoords = graphRef.current.graph2ScreenCoords(
      position.x,
      position.y
    );
    x = screenCoords.x;
    y = screenCoords.y;
  }
  //   console.log(name);
  //   console.log(graphRef.current);
  //   console.log(x, y);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "5px",
        borderRadius: "3px",
        zIndex: 1000,
        color: "#FFFFFF",
      }}
    >
      <p>death</p>
      {name}
    </div>
  );
};

export default NodeLabel;
