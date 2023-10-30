/*
 * global.d.ts
 * Author: evan kirkiles
 * Created on: Mon Oct 30 2023
 * 2023 Yale SWE
 */

import { Prisma } from "@prisma/client";

const personWithProductions = Prisma.validator<Prisma.PersonDefaultArgs>()({
  include: {
    productions: true,
  },
});

export type PersonWithProductions = Prisma.PersonGetPayload<
  typeof personWithProductions
>;

const productionWithPerson = Prisma.validator<Prisma.ProductionDefaultArgs>()({
  include: {
    persons: true,
    organization: true,
  },
});

export type ProductionWithPeople = Prisma.ProductionGetPayload<
  typeof productionWithPerson
>;
