/*
 * useGraphInformation.ts
 * author: evan kirkiles
 * created on Fri Nov 10 2023
 * 2023 Yale SWE
 */

import { useEffect, useState } from "react";
import { GraphData } from "react-force-graph-2d";

export default function useGraphInformation(
  graphData: GraphData<{}, {}> | undefined
) {
  const [graphCount, setGraphCount] = useState<
    { [key: string]: number } | undefined
  >(undefined);
  useEffect(() => {
    if (!graphData) {
      setGraphCount(undefined);
      return;
    }
    setGraphCount(
      graphData.nodes.reduce((acc, { _type }) => {
        acc[_type] = (acc[_type] ?? 0) + 1;
        return acc;
      }, {})
    );
  }, [graphData]);
  return graphCount;
}
