import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function repairDatabase() {
  console.log('--- Iniciando reparacion de base de datos ---');

  const corruptedAlumnoIds = [
    1246, // soft restaurant
    1249, // juan garcia dos
    1250, // juan garcia tres
    1253, // DANAE GARCÍA JIMÉNEZ
    1255, // juan garcia seis
  ];

  const inscripcionLiu = await prisma.inscripcionCiclo.findUnique({
    where: { inscripcionId: 1146 }
  });
  if (inscripcionLiu && inscripcionLiu.alumnoId) {
    if (!corruptedAlumnoIds.includes(inscripcionLiu.alumnoId)) {
      corruptedAlumnoIds.push(inscripcionLiu.alumnoId);
    }
  }

  console.log(`Se encontraron ${corruptedAlumnoIds.length} alumnos con datos corruptos listos para ser dados de baja.`);

  for (const alumnoId of corruptedAlumnoIds) {
    try {
      const alumno = await prisma.alumno.findUnique({ where: { alumnoId } });
      if (alumno && !alumno.eliminadoEn) {
        console.log(`Ejecutando Baja Definitiva para ID: ${alumnoId} - ${alumno.nombreCompleto}...`);
        
        await prisma.$transaction(async (tx: any) => {
          // 1. Soft delete del alumno
          await tx.alumno.update({
            where: { alumnoId },
            data: {
              eliminadoEn: new Date(),
              estado: 'BAJA_DEFINITIVA'
            }
          });

          // 2. Anular matrículas/inscripciones activas en este ciclo escolar
          await tx.inscripcionCiclo.updateMany({
            where: { alumnoId, eliminadoEn: null },
            data: {
              eliminadoEn: new Date(),
              estadoEnCiclo: 'BAJA_DEFINITIVA'
            }
          });
        });

        console.log(`  -> Alumno ${alumnoId} dado de baja exitosamente.`);
      } else {
        console.log(`Alumno ID: ${alumnoId} ya esta eliminado o no existe.`);
      }
    } catch (error: any) {
      console.error(`Error al reparar el alumno ${alumnoId}:`, error.message);
    }
  }

  console.log('\n[+] Proceso de reparacion finalizado.');
}

repairDatabase().catch(console.error).finally(() => prisma.$disconnect());
