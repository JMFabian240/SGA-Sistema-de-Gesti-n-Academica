import { prisma } from '../packages/data-access/src/client';

async function check() {
  const planes = await prisma.planPago.findMany();
  console.log(JSON.stringify(planes, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
