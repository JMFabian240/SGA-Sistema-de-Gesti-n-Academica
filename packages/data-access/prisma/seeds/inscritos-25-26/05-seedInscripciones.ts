import { PrismaClient } from '@prisma/client';
import { InscripcionesService } from '../../../../back-end/src/modules/inscripciones/inscripciones.service';
import { parseExcel, parseSheetName, getLetraGrupo } from './excelHelper';

export const seedInscripciones = async (prisma: PrismaClient) => {
  console.log('--- 05 Creando Inscripciones ---');

  const { alumnosList } = parseExcel();
  
  const cicloAnual = await prisma.cicloEscolar.findFirst({ where: { activo: true, periodicidad: 'ANUAL' } });
  const cicloSemestral = await prisma.cicloEscolar.findFirst({ where: { activo: true, periodicidad: 'SEMESTRAL' } });
  const plan10 = await prisma.planPago.findFirst({ where: { meses: 10 } });
  const plan12 = await prisma.planPago.findFirst({ where: { meses: 12 } });

  if (!cicloAnual || !cicloSemestral || !plan10 || !plan12) throw new Error('Catálogos base no encontrados');

  // Buscar todos los alumnos para poder asociarlos
  const alumnosDB = await prisma.alumno.findMany();
  const gruposDB = await prisma.grupo.findMany();
  const gradosDB = await prisma.grado.findMany({ include: { nivel: true } });

  for (const row of alumnosList) {
    // Encontramos al alumno por nombre
    const alumno = alumnosDB.find(a => a.nombreCompleto === row.nombre.substring(0, 120));
    if (!alumno) continue;

    const { gradoNum, nivelCode } = parseSheetName(row.sheetName);
    const grado = gradosDB.find(g => g.numero === gradoNum && g.nivel.codigo === nivelCode);
    const cicloParaInscripcion = nivelCode === 'BAC' ? cicloSemestral : cicloAnual;
    const letra = getLetraGrupo(nivelCode);
    
    // Encontramos el grupo por letra y grado
    const grupo = gruposDB.find(g => g.nombre === letra && g.cicloId === cicloParaInscripcion.cicloId && g.gradoId === grado?.gradoId);
    
    const planId = row.pagoMeses === 12 ? plan12.planPagoId : plan10.planPagoId;

    const inscripcion = await InscripcionesService.createInscripcion({
      alumnoId: alumno.alumnoId,
      cicloId: cicloParaInscripcion.cicloId,
      grupoId: grupo?.grupoId,
      fechaIngreso: new Date().toISOString(),
      estadoEnCiclo: 'INSCRITO',
      estadoFinanciero: row.moroso ? 'MOROSO' : 'AL_CORRIENTE',
      esIngresoTardio: false
    });

    await InscripcionesService.asignarPlanPago({
      inscripcionId: inscripcion.inscripcionId,
      planPagoId: planId
    });
  }
};
