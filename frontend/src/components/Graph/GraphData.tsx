"use client";

import { anchoredNodeIdAtom, dataSourceAtom } from "@/app/state";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { NodeQueryKey } from "@/util/query";

interface GraphDataProps {
  source: NodeQueryKey;
  anchoredNodeId?: string;
}

function GraphData({ source, anchoredNodeId }: GraphDataProps) {
  const setAnchoredNodeId = useSetAtom(anchoredNodeIdAtom);
  const setDataSource = useSetAtom(dataSourceAtom);
  useEffect(() => {
    setDataSource(source);
    setAnchoredNodeId(anchoredNodeId);
  }, [setDataSource, setAnchoredNodeId, source, anchoredNodeId]);
  return <></>;
}

export default GraphData;
