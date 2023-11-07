"use client";

import { anchoredNodeAtom, dataSourceAtom } from "@/app/state";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { NodeQueryKey } from "@/util/query";

interface GraphDataProps {
  source: NodeQueryKey;
  anchoredNodeId?: string;
}

function GraphData({ source, anchoredNodeId }: GraphDataProps) {
  const setAnchoredNode = useSetAtom(anchoredNodeAtom);
  const setDataSource = useSetAtom(dataSourceAtom);
  useEffect(() => {
    setDataSource(source);
    setAnchoredNode(anchoredNodeId);
  }, [setDataSource, setAnchoredNode, source, anchoredNodeId]);
  return <></>;
}

export default GraphData;
