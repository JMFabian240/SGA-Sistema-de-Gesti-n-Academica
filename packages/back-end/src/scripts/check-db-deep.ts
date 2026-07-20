import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('--- Iniciando analisis completo de base de datos ---');

  // 1. Alumnos sin nivel escolar
  const alumnosSinNivel = await prisma.alumno.findMany({
    where: { nivelId: { equals: null as any }, eliminadoEn: null } // Prisma schema actually requires nivelId to be Int, let's see if there are missing ones if schema changed. Wait, schema has `nivelId Int`. So it can't be null. 
  }).catch(() => []);
  
  // 1.5 Alumnos sin grado
  const alumnosSinGrado = await prisma.alumno.findMany({
    where: { gradoId: null, eliminadoEn: null }
  });

  console.log(`\n1. Alumnos sin grado asignado en la informacion base: ${alumnosSinGrado.length}`);
  alumnosSinGrado.slice(0, 5).forEach((a: any) => console.log('  - ID:', a.alumnoId, '| Nombre:', a.nombreCompleto));
  if(alumnosSinGrado.length > 5) console.log(`  ... y ${alumnosSinGrado.length - 5} mas.`);

  // 2. Alumnos "ACTIVO" o "INSCRITO" pero sin tabla de inscripcion activa
  const alumnosConEstadoPeroSinInscripcion = await prisma.alumno.findMany({
    where: {
      estado: { in: ['ACTIVO'] },
      inscripciones: { none: { eliminadoEn: null } },
      eliminadoEn: null
    }
  });

  console.log(`\n2. Alumnos ACTIVO/INSCRITO pero sin Inscripcion Academica: ${alumnosConEstadoPeroSinInscripcion.length}`);
  alumnosConEstadoPeroSinInscripcion.slice(0, 5).forEach((a: any) => console.log('  - ID:', a.alumnoId, '| Nombre:', a.nombreCompleto, '| Estado:', a.estado));
  if(alumnosConEstadoPeroSinInscripcion.length > 5) console.log(`  ... y ${alumnosConEstadoPeroSinInscripcion.length - 5} mas.`);

  // 3. Alumnos cuyo grado actual no coincide con la inscripcion
  const inscripcionesInconsistentes = await prisma.inscripcionCiclo.findMany({
    where: { eliminadoEn: null },
    include: {
      alumno: true
    }
  });

  const badSync = inscripcionesInconsistentes.filter((i: any) => i.alumno && i.gradoId !== i.alumno.gradoId);
  console.log(`\n3. Inscripciones cuyo Grado no coincide con el Grado base del Alumno: ${badSync.length}`);
  badSync.slice(0, 5).forEach((i: any) => console.log('  - Inscripcion ID:', i.inscripcionId, '| Alumno:', i.alumno?.nombreCompleto));

  // 4. Inscripciones cuyo grupo no pertenece al grado
  const inscripciones = await prisma.inscripcionCiclo.findMany({
    where: { eliminadoEn: null },
    include: { grupo: true }
  });
  const badGrupos = inscripciones.filter((i: any) => i.grupo && i.gradoId !== i.grupo.gradoId);
  console.log(`\n4. Inscripciones con Grupo que no pertenece a su Grado: ${badGrupos.length}`);

}

checkDatabase().catch(console.error).finally(() => prisma.$disconnect());
