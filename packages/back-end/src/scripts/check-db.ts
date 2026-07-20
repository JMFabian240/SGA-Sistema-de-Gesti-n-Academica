import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('--- Iniciando analisis de base de datos ---');
  let issues = 0;

  // 1. Alumnos sin tutor
  const alumnosSinTutor = await prisma.alumno.findMany({
    where: { tutoresAlumnos: { none: {} }, eliminadoEn: null }
  });
  if (alumnosSinTutor.length > 0) {
    console.log('\n[!] Alumnos sin tutor (Huerfanos):', alumnosSinTutor.length);
    alumnosSinTutor.forEach((a: any) => console.log('  - ID:', a.alumnoId, '| Nombre:', a.nombreCompleto));
    issues++;
  }

  // 2. Alumnos con grado que no coincide con su nivel
  const alumnosConGradoInconsistente = await prisma.alumno.findMany({
    where: {
      gradoId: { not: null },
      eliminadoEn: null
    },
    include: {
      nivel: true,
      grado: true
    }
  });
  
  const badGrados = alumnosConGradoInconsistente.filter((a: any) => a.grado && a.nivel && a.grado.nivelId !== a.nivel.nivelId);
  if (badGrados.length > 0) {
    console.log('\n[!] Alumnos cuyo Grado no pertenece a su Nivel Escolar:', badGrados.length);
    badGrados.forEach((a: any) => console.log('  - ID:', a.alumnoId, '| Nombre:', a.nombreCompleto, '| Nivel:', a.nivel?.nombre, '| Grado:', a.grado?.nombre));
    issues++;
  }

  // 3. Inscripciones inconsistentes (grado/grupo mismatch o nivel mismatch)
  const inscripcionesInconsistentes = await prisma.inscripcionCiclo.findMany({
    where: { eliminadoEn: null },
    include: {
      alumno: { include: { nivel: true } },
      grado: true,
      grupo: { include: { grado: true } }
    }
  });

  const badInscripciones = inscripcionesInconsistentes.filter((i: any) => {
    // El grado de la inscripcion no pertenece al nivel del alumno
    const mismatchNivel = i.grado && i.alumno?.nivel && i.grado.nivelId !== i.alumno.nivel.nivelId;
    // El grupo no pertenece al grado
    const mismatchGrupo = i.grupo && i.grado && i.grupo.gradoId !== i.grado.gradoId;
    return mismatchNivel || mismatchGrupo;
  });

  if (badInscripciones.length > 0) {
    console.log('\n[!] Inscripciones con datos cruzados (Grado/Nivel o Grupo/Grado):', badInscripciones.length);
    badInscripciones.forEach((i: any) => console.log('  - Inscripcion ID:', i.inscripcionId, '| Alumno:', i.alumno?.nombreCompleto, '| Nivel Alumno:', i.alumno?.nivel?.nombre, '| Grado Inscrito:', i.grado?.nombre, '| Grupo Inscrito:', i.grupo?.nombre));
    issues++;
  }

  if (issues === 0) {
    console.log('\n[+] ¡La base de datos parece estar en buen estado! No se encontraron inconsistencias comunes.');
  }
}

checkDatabase().catch(console.error).finally(() => prisma.$disconnect());
