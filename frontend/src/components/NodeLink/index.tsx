/*
 * index.tsx
 * Author: evan kirkiles
 * Created on: Tue Nov 07 2023
 * 2023 Yale SWE
 */
"use client";

import { hoveredNodeAtom } from "@/app/state";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { ComponentProps, PropsWithChildren } from "react";
import s from "./NodeLink.module.scss";

interface NodeLinkProps extends PropsWithChildren {
  nodeType: "production" | "person";
  nodeId: number;
}

export default function NodeLink({
  nodeType,
  nodeId,
  children,
  ...props
}: NodeLinkProps & Omit<ComponentProps<typeof Link>, "href">) {
  const setHoveredNode = useSetAtom(hoveredNodeAtom);
  const href = `/${
    nodeType === "production" ? "productions" : "people"
  }/${nodeId}`;
  const nodeGraphId = `${nodeType.substring(0, 4)}_${nodeId}`;

  return (
    <Link
      href={href}
      {...props}
      prefetch={false}
      className={`${props.className} ${s.node_link}`}
      onMouseEnter={() => setHoveredNode(nodeGraphId)}
      onMouseLeave={() => setHoveredNode(undefined)}
      data-node-type={nodeType}
    >
      {children}
    </Link>
  );
}
