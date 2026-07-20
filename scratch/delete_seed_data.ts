import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clean() {
  console.log('Borrando datos insertados por la seed...');
  await prisma.calendarioPago.deleteMany({});
  await prisma.inscripcionCiclo.deleteMany({});
  await prisma.tutorAlumno.deleteMany({});
  await prisma.alumno.deleteMany({});
  await prisma.tutor.deleteMany({});
  await prisma.grupo.deleteMany({});
  await prisma.cicloEscolar.deleteMany({
    where: { nombre: { in: ['2025-2026', '2025-2026 S1'] } }
  });
  await prisma.planPago.deleteMany({
    where: { nombre: { in: ['Plan 10 Meses', 'Plan 12 Meses'] } }
  });
  console.log("Datos borrados exitosamente.");
}

clean()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
