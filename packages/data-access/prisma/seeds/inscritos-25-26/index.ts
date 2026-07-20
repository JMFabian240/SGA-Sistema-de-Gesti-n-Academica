import { PrismaClient } from '@prisma/client';
import { seedPlanesPago } from './01-seedPlanesPago';
import { seedCiclosEscolares } from './02-seedCiclosEscolares';
import { seedGrupos } from './03-seedGrupos';
import { seedAlumnosTutores } from './04-seedAlumnosTutores';
import { seedInscripciones } from './05-seedInscripciones';
import { seedCalendarioPagos } from './06-seedPagosSimulados';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Ejecución de Seeds por Tablas ---');
  
  // En este punto asumimos que la BD fue limpiada previamente, o
  // que se maneja de forma idempotente para Alumnos/Tutores si se requiere
  // (Por el momento, Alumnos/Tutores siempre insertará si la BD esta vacia)

  await seedPlanesPago(prisma);
  await seedCiclosEscolares(prisma);
  await seedGrupos(prisma);
  await seedAlumnosTutores(prisma);
  await seedInscripciones(prisma);
  await seedCalendarioPagos(prisma);

  console.log('--- Seed completado exitosamente ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
