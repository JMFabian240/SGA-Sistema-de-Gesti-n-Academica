import { prisma } from '../packages/data-access/src/client';

async function check() {
  const niveles = await prisma.nivelEducativo.findMany({ include: { grados: true }});
  console.log(JSON.stringify(niveles, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
