import { PrismaClient } from '@prisma/client';
import { GruposService } from '../../../../back-end/src/modules/grupos/grupos.service';

export const seedCiclosEscolares = async (prisma: PrismaClient) => {
  console.log('--- 02 Creando Ciclos Escolares ---');
  
  // Nivel Educativo IDs (PRE, PRI, SEC, BAC)
  const niveles = await prisma.nivelEducativo.findMany();
  
  let cicloAnual = await prisma.cicloEscolar.findFirst({ where: { activo: true, periodicidad: 'ANUAL' } });
  if (!cicloAnual) {
    const gradosAnuales = await prisma.grado.findMany({
      where: { nivel: { codigo: { in: ['PRE', 'PRI', 'SEC'] } } }
    });
    const gradosPermitidos = gradosAnuales.reduce((acc, curr) => {
      if (!acc[curr.nivelId]) acc[curr.nivelId] = [];
      acc[curr.nivelId].push(curr.gradoId);
      return acc;
    }, {} as Record<string, number[]>);

    cicloAnual = await GruposService.createCiclo({
      nombre: '2025-2026',
      fechaInicio: '2025-08-01T00:00:00.000Z',
      fechaFin: '2026-07-15T00:00:00.000Z',
      activo: true,
      periodicidad: 'ANUAL',
      gradosPermitidos
    }) as any;
  }

  let cicloSemestral = await prisma.cicloEscolar.findFirst({ where: { activo: true, periodicidad: 'SEMESTRAL' } });
  if (!cicloSemestral) {
    const gradosSemestrales = await prisma.grado.findMany({
      where: { nivel: { codigo: 'BAC' } }
    });
    const gradosPermitidos = gradosSemestrales.reduce((acc, curr) => {
      if (!acc[curr.nivelId]) acc[curr.nivelId] = [];
      acc[curr.nivelId].push(curr.gradoId);
      return acc;
    }, {} as Record<string, number[]>);

    cicloSemestral = await GruposService.createCiclo({
      nombre: '2025-2026 S1',
      fechaInicio: '2025-08-01T00:00:00.000Z',
      fechaFin: '2026-01-15T00:00:00.000Z',
      activo: true,
      periodicidad: 'SEMESTRAL',
      gradosPermitidos
    }) as any;
  }

  // --- Crear Tarifas ---
  // AlumnosService.asignarPlanPago depende de las tarifas activas de COLEGIATURA para el ciclo y nivel.
  // Vamos a inyectar directamente a Prisma las tarifas para Colegiatura.
  for (const nivel of niveles) {
    const cicloId = nivel.codigo === 'BAC' ? cicloSemestral!.cicloId : cicloAnual!.cicloId;
    const monto = nivel.codigo === 'BAC' ? 2200 : 2500; // Plan 12 meses (2200) o Plan 10 meses (2500)
    
    const existeTarifa = await prisma.tarifa.findFirst({
      where: { cicloId, nivelId: nivel.nivelId, concepto: 'COLEGIATURA', activa: true }
    });

    if (!existeTarifa) {
      await prisma.tarifa.create({
        data: {
          cicloId,
          nivelId: nivel.nivelId,
          concepto: 'COLEGIATURA',
          monto: monto,
          activa: true
        }
      });
    }
  }
};
