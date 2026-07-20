import { PrismaClient } from '@prisma/client';
import { seedPlanesPago } from '../packages/data-access/prisma/seeds/inscritos-25-26/01-seedPlanesPago';
import { seedCiclosEscolares } from '../packages/data-access/prisma/seeds/inscritos-25-26/02-seedCiclosEscolares';
import { seedGrupos } from '../packages/data-access/prisma/seeds/inscritos-25-26/03-seedGrupos';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Ejecutando Seeds 01 a 03 ---');
  await seedPlanesPago(prisma);
  await seedCiclosEscolares(prisma);
  await seedGrupos(prisma);
  console.log('--- Finalizado ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
