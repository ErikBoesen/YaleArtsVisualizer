/*
 * prisma.ts
 * Author: evan kirkiles
 * Created on: Sun Oct 29 2023
 * 2023 Yale SWE
 */

import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL! } },
}).$extends({
  result: {
    production: {
      _type: {
        needs: {},
        compute: () => "production",
      },
    },
    person: {
      _type: {
        needs: {},
        compute: () => "person",
      },
    },
    productionPersonEdge: {
      _type: {
        needs: {},
        compute: () => "productionpersonedge",
      },
    },
  },
});
// .$extends(withAccelerate());
