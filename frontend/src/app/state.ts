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

export const dataSourceAtom = atom<NodeQueryKey>(["static", "home"]);
export const selectedNodeAtom = atom("");
