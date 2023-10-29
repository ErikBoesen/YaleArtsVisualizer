/*
 * route.ts
 * Author: evan kirkiles
 * Created on: Sun Oct 29 2023
 * 2023 Yale SWE
 */

import { NextResponse } from "next/server";

export async function GET() {
  // returns edges on nodes
  return NextResponse.json({ success: true });
}
