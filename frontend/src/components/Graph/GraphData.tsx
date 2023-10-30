"use client";

import { useHydrateAtoms } from "jotai/utils";
import { dataSourceAtom } from "@/app/state";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

function GraphData({ source }: { source: string }) {
  const setDataSource = useSetAtom(dataSourceAtom);
  useEffect(() => {
    setDataSource(source);
  }, [setDataSource, source]);
  // useHydrateAtoms([[dataSourceAtom, source]]);
  return <></>;
}

export default GraphData;
