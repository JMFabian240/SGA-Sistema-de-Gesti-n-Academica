import { describe, it, expect } from 'vitest';
import { appRouter } from '../../src/router';
import { prisma } from '@sga/data-access';
import { createTestContext } from './testUtils';

describe('Calificaciones Router (Integration)', () => {
  it('debería registrar y actualizar una calificación exitosamente (upsert)', async () => {
    const { ctx, usuario } = await createTestContext(['Calificaciones']);
    const caller = appRouter.createCaller(ctx);

    // 1. Preparar dependencias en BD
    const nivel = await prisma.nivelEducativo.upsert({
      where: { codigo: 'SEC_CALIF' },
      update: {},
      create: { codigo: 'SEC_CALIF', nombre: 'Secundaria', orden: 3 }
    });

    const ciclo = await prisma.cicloEscolar.create({
      data: {
        nombre: '2024-2025',
        fechaInicio: new Date('2024-08-01'),
        fechaFin: new Date('2025-07-15'),
        activo: true
      }
    });

    const materia = await prisma.materia.upsert({
      where: { clave: 'FIS1_CALIF' },
      update: {},
      create: { nombre: 'Física I', clave: 'FIS1_CALIF' }
    });

    // Nota: El modelo Grado es requerido en schema.prisma si nivel es agregado, pero en grupos solo nivelId. 
    // Usaremos un UPSERT manual o create para el grupo ya que no tiene unique puro sin ID, pero no hay problema con create si el nivel es nuevo.
    // Wait, Grupo requires gradoId en el esquema actual. Vamos a crearlo u omitirlo si el esquema lo permite.
    // Revisando el esquema: `gradoId` está en Grupo. Let's create a Grado first.
    // En las versiones anteriores del test de pagos no creamos grupo. Aquí sí.
    const grado = await prisma.grado.create({
      data: {
        nivelId: nivel.nivelId,
        numero: 3,
        nombre: 'Tercero'
      }
    });

    const grupo = await prisma.grupo.create({
      data: {
        nivelId: nivel.nivelId,
        cicloId: ciclo.cicloId,
        gradoId: grado.gradoId,
        nombre: '3A',
        cupoMaximo: 30
      }
    });

    const grupoMateria = await prisma.grupoMateria.create({
      data: {
        grupoId: grupo.grupoId,
        materiaId: materia.materiaId,
        docenteId: usuario.usuarioId
      }
    });

    const alumno = await prisma.alumno.create({
      data: {
        nombreCompleto: 'Alumno Calificacion',
        curp: `TS${Date.now()}EFG`,
        fechaNacimiento: new Date('2010-05-15'),
        sexo: 'M',
        estado: 'ACTIVO',
        nivelId: nivel.nivelId
      }
    });

    // 2. Registrar calificación (Insert)
    const upsertResult = await caller.calificaciones.upsert({
      alumnoId: alumno.alumnoId,
      grupoMateriaId: grupoMateria.grupoMateriaId,
      periodoId: 1, // Primer Bimestre
      tipoEvaluacion: 'BIMESTRE',
      valorNumerico: 9.5,
      textoObservacion: 'Excelente trabajo'
    });
    
    expect(upsertResult.calificacionId).toBeDefined();

    // 3. Verificar en BD (Insert)
    let dbCalificacion = await prisma.calificacion.findUnique({
      where: { calificacionId: upsertResult.calificacionId }
    });
    expect(dbCalificacion).not.toBeNull();
    expect(dbCalificacion?.valorNumerico?.toNumber()).toBe(9.5);
    expect(dbCalificacion?.textoObservacion).toBe('Excelente trabajo');

    // 4. Registrar calificación (Update del mismo periodo)
    const updateResult = await caller.calificaciones.upsert({
      alumnoId: alumno.alumnoId,
      grupoMateriaId: grupoMateria.grupoMateriaId,
      periodoId: 1, // Mismo periodo
      tipoEvaluacion: 'BIMESTRE',
      valorNumerico: 10.0,
      textoObservacion: 'Corregido a 10'
    });

    expect(updateResult.calificacionId).toBe(upsertResult.calificacionId); // Debe ser el mismo ID

    // 5. Verificar en BD (Update)
    dbCalificacion = await prisma.calificacion.findUnique({
      where: { calificacionId: updateResult.calificacionId }
    });
    expect(dbCalificacion?.valorNumerico?.toNumber()).toBe(10);
    expect(dbCalificacion?.textoObservacion).toBe('Corregido a 10');
  });

  it('debería rechazar si no se envía ni valor numérico ni cualitativo (Zod Refine)', async () => {
    const { ctx } = await createTestContext(['Calificaciones']);
    const caller = appRouter.createCaller(ctx);

    const calificacionInvalida = {
      alumnoId: 1,
      grupoMateriaId: 1,
      periodoId: 1,
      tipoEvaluacion: 'BIMESTRE' as const,
      // Falta valorNumerico y valorCualitativo
      textoObservacion: 'No tiene valor'
    };

    await expect(caller.calificaciones.upsert(calificacionInvalida))
      .rejects.toThrowError(/Debe proporcionar al menos un valor numérico o cualitativo/);
  });
});
