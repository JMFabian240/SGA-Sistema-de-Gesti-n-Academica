import { describe, it, expect } from 'vitest';
import { appRouter } from '../../src/router';
import { prisma } from '@sga/data-access';
import { createTestContext } from './testUtils';

describe('Inscripciones Router (Integration)', () => {
  it('debería crear un plan de pago e inscribir a un alumno exitosamente', async () => {
    const { ctx } = await createTestContext(['Inscripciones', 'Alumnos', 'Pagos']);
    const caller = appRouter.createCaller(ctx);

    // 1. Preparar BD con dependencias
    const nivel = await prisma.nivelEducativo.upsert({
      where: { codigo: 'PREP_INS' },
      update: {},
      create: { codigo: 'PREP_INS', nombre: 'Preparatoria', orden: 4 }
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
        nombreCompleto: 'Alumno Inscripcion',
        curp: `TS${Date.now()}BCD`,
        fechaNacimiento: new Date('2005-05-15'),
        sexo: 'M',
        estado: 'ACTIVO',
        nivelId: nivel.nivelId
      }
    });

    // 2. Crear Plan de Pago
    const planResult = await caller.inscripciones.createPlanPago({
      nombre: 'Plan Normal 10 Meses',
      meses: 10,
      montoMensual: 2000.00,
      montoDiciembre: 1000.00,
      activo: true
    });
    expect(planResult.planPagoId).toBeDefined();

    // 3. Crear Inscripción
    const inscripcionResult = await caller.inscripciones.createInscripcion({
      alumnoId: alumno.alumnoId,
      cicloId: ciclo.cicloId,
      fechaIngreso: new Date('2024-08-15').toISOString(),
      esIngresoTardio: false,
      estadoEnCiclo: 'INSCRITO',
      estadoFinanciero: 'NO_APLICA'
    });
    expect(inscripcionResult.inscripcionId).toBeDefined();

    await caller.inscripciones.asignarPlanPago({
      inscripcionId: inscripcionResult.inscripcionId,
      planPagoId: planResult.planPagoId
    });

    // 4. Verificar en Base de Datos
    const dbInscripcion = await prisma.inscripcionCiclo.findUnique({
      where: { inscripcionId: inscripcionResult.inscripcionId },
      include: {
        alumno: true,
        ciclo: true,
        planPago: true
      }
    });

    expect(dbInscripcion).not.toBeNull();
    expect(dbInscripcion?.alumno.curp).toBe(alumno.curp);
    expect(dbInscripcion?.planPago?.meses).toBe(10);
    expect(dbInscripcion?.planPago?.montoMensual.toNumber()).toBe(2000);
    expect(dbInscripcion?.estadoEnCiclo).toBe('INSCRITO');
  });

  it('debería rechazar inscripción si el plan de pago no existe (Constraint BD)', async () => {
    const { ctx } = await createTestContext(['Inscripciones', 'Alumnos', 'Pagos']);
    const caller = appRouter.createCaller(ctx);

    // Preparar dependencias
    const nivel = await prisma.nivelEducativo.upsert({
      where: { codigo: 'PREP_INS2' },
      update: {},
      create: { codigo: 'PREP_INS2', nombre: 'Preparatoria 2', orden: 4 }
    });

    const ciclo = await prisma.cicloEscolar.create({
      data: {
        nombre: '2025-2026',
        fechaInicio: new Date('2025-08-01'),
        fechaFin: new Date('2026-07-15'),
        activo: true
      }
    });

    const alumno = await prisma.alumno.create({
      data: {
        nombreCompleto: 'Alumno Fallido',
        curp: `TS${Date.now()}FGH`,
        fechaNacimiento: new Date('2005-05-15'),
        sexo: 'M',
        estado: 'ACTIVO',
        nivelId: nivel.nivelId
      }
    });

    const inscripcionValida = {
      alumnoId: alumno.alumnoId,
      cicloId: ciclo.cicloId,
      fechaIngreso: new Date('2024-08-15').toISOString(),
      esIngresoTardio: false,
      estadoEnCiclo: 'INSCRITO',
      estadoFinanciero: 'NO_APLICA'
    };

    const resInscripcion = await caller.inscripciones.createInscripcion(inscripcionValida);

    // Lanzará un error TRPC (NOT_FOUND) porque el planPagoId no existe
    await expect(caller.inscripciones.asignarPlanPago({
      inscripcionId: resInscripcion.inscripcionId,
      planPagoId: 99999
    })).rejects.toThrowError(/Plan de pago no encontrado/);
  });
});
