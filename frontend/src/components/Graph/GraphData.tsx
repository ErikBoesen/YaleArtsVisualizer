"use client";

import { useHydrateAtoms } from "jotai/utils";
import { dataSourceAtom } from "@/app/state";

function GraphData({ source }: { source: string }) {
  useHydrateAtoms([[dataSourceAtom, source]]);
  return <></>
}

export default GraphData;