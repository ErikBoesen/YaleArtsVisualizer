/*
 * route.ts
 * Author: Evan Kirkiles
 * Created on: Tue Sep 26 2023
 * 2023 Yale SWE
 */

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const productions = await prisma.production.findMany();
  return NextResponse.json({ productions });
}
