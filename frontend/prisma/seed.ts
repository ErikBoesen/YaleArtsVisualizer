/*
 * seed.ts
 * Author: evan kirkiles
 * Created on: Mon Oct 30 2023
 * 2023 Yale SWE
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.organization.upsert({
    where: { id: "ydn" },
    update: {},
    create: {
      id: "ydn",
      title: "Yale Daily News",
      description:
        "The Yale Daily News is an independent student newspaper published by Yale University students in New Haven, Connecticut since January 28, 1878. It is the oldest college daily newspaper in the United States. The Yale Daily News has consistently been ranked among the top college daily newspapers in the country.",
    },
  });
  await prisma.organization.upsert({
    where: { id: "collegearts" },
    update: {},
    create: {
      id: "collegearts",
      title: "Yale College Arts",
      description:
        "At Yale College, you will find a thriving arts community that offers hundreds of opportunities to study the arts and even more to create them. Yale students study alongside some of the world’s leading scholars and artists, and as they become scholars and artists themselves, they draw on the university’s substantial resources, among them its museum collections, performance and exhibition spaces, and faculty mentorship. Inside and beyond the classroom, the arts are an integral part of a Yale education.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
