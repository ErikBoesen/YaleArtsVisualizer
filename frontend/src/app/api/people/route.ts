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
  const people = await prisma.person.findMany();
  return NextResponse.json({ people });
}
