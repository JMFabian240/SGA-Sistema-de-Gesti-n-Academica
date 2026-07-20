import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const inscripciones = await prisma.inscripcionCiclo.findMany({
    where: { eliminadoEn: null },
    include: { grupo: true, alumno: { include: { nivel: true } }, grado: true }
  });
  const badGrupos = inscripciones.filter((i: any) => i.grupo && i.gradoId !== i.grupo.gradoId);
  badGrupos.forEach((i: any) => console.log('Inscripcion:', i.inscripcionId, '| Alumno:', i.alumno?.nombreCompleto, '| Nivel:', i.alumno?.nivel?.nombre, '| Grado Insc:', i.grado?.nombre, '| Grupo Insc:', i.grupo?.nombre, '(El grupo pertenece al grado con ID', i.grupo?.gradoId, ')'));
}
check().finally(() => prisma.$disconnect());
