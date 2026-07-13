import { describe, it, expect } from 'vitest';
import { appRouter } from '../../src/router';
import { prisma } from '@sga/data-access';
import { createTestContext } from './testUtils';

describe('Becas Router (Integration)', () => {
  it('debería crear beca, solicitarla y resolverla atómicamente', async () => {
    const { ctx } = await createTestContext(['Becas']);
    const caller = appRouter.createCaller(ctx);

    // 1. Preparar dependencias en BD
    const nivel = await prisma.nivelEducativo.upsert({
      where: { codigo: 'PRE_BECAS' },
      update: {},
      create: { codigo: 'PRE_BECAS', nombre: 'Preescolar', orden: 1 }
    });

    const ciclo = await prisma.cicloEscolar.create({
      data: {
        nombre: '2024-2025',
        fechaInicio: new Date('2024-08-01'),
        fechaFin: new Date('2025-07-15'),
        activo: true
      }
    });

    const alumno = await prisma.alumno.create({
      data: {
        nombreCompleto: 'Alumno Beca',
        curp: `TS${Date.now()}DEF`,
        fechaNacimiento: new Date('2015-05-15'),
        sexo: 'M',
        estado: 'ACTIVO',
        nivelId: nivel.nivelId
      }
    });

    // 2. Crear Beca
    const becaResult = await caller.becas.createBeca({
      nombreBeca: 'Beca Excelencia 50%',
      criterio: 'ACADEMICA',
      porcentaje: 50.00
    });
    expect(becaResult.becaId).toBeDefined();

    // 3. Solicitar Beca
    const solicitudResult = await caller.becas.createSolicitud({
      alumnoId: alumno.alumnoId,
      becaId: becaResult.becaId,
      cicloId: ciclo.cicloId,
      motivo: 'Promedio de 10',
      estado: 'ACTIVA'
    });
    expect(solicitudResult.solicitudId).toBeDefined();

    // 4. Resolver Solicitud (Aprobarla genera la Asignación)
    const resolucionResult = await caller.becas.resolverSolicitud({
      solicitudId: solicitudResult.solicitudId,
      aprobar: true,
      observacionesResolucion: 'Aprobada por comité'
    });

    expect(resolucionResult.asignacion).toBeDefined();
    expect(resolucionResult.asignacion?.estado).toBe('ACTIVA');

    // 5. Verificar en BD que la asignación existe
    const dbAsignacion = await prisma.asignacionBeca.findUnique({
      where: { asignacionId: resolucionResult.asignacion!.asignacionId },
      include: {
        solicitud: true,
        alumno: true,
        beca: true
      }
    });

    expect(dbAsignacion).not.toBeNull();
    expect(dbAsignacion?.beca.porcentaje.toNumber()).toBe(50);
    expect(dbAsignacion?.alumno.curp).toBe(alumno.curp);
    expect(dbAsignacion?.solicitud?.estado).toBe('ACTIVA');
  });

  it('debería rechazar porcentaje de beca mayor a 100 (Zod)', async () => {
    const { ctx } = await createTestContext(['Becas']);
    const caller = appRouter.createCaller(ctx);

    const becaInvalida = {
      nombreBeca: 'Beca Imposible',
      criterio: 'ACADEMICA' as const,
      porcentaje: 150.00 // Invalido
    };

    await expect(caller.becas.createBeca(becaInvalida))
      .rejects.toThrowError(/El porcentaje máximo es 100|too_big/);
  });
});
