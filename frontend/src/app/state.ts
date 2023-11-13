/*
 * state.ts
 * Author: evan kirkiles
 * Created on: Sat Oct 28 2023
 * 2023 Yale SWE
 *
 * This file defines the global state atoms needed for our application.
 */

import { NodeQueryKey } from "@/util/query";
import { atom } from "jotai";
import { ExtendedNodeObject } from "./api/graph/utils";

export const dataSourceAtom = atom<NodeQueryKey>(["static", "home"]);
export const anchoredNodeIdAtom = atom<string | undefined>(undefined);
export const anchoredNodeAtom = atom<ExtendedNodeObject | undefined>(undefined);
export const hoveredNodeAtom = atom<ExtendedNodeObject | undefined>(undefined);
