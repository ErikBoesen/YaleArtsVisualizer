/*
 * prisma.ts
 * Author: evan kirkiles
 * Created on: Sun Oct 29 2023
 * 2023 Yale SWE
 */

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient().$extends(withAccelerate());
