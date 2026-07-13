import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from '../../src/router';
import { prisma } from '@sga/data-access';
import { createTestContext } from './testUtils';

describe('Alumnos Router (Integration)', () => {
  it('debería crear un alumno con su tutor atómicamente', async () => {
    const { ctx } = await createTestContext(['Alumnos']);
    const caller = appRouter.createCaller(ctx);

    const nivel = await prisma.nivelEducativo.upsert({
      where: { codigo: 'SEC_TEST1' },
      update: {},
      create: {
        nombre: 'Secundaria',
        codigo: 'SEC_TEST1',
        orden: 1
      }
    });

    const tutorMock = {
      nombreCompleto: 'Juan Perez',
      parentesco: 'Padre',
      telefono: '5551234567',
      correo: 'juan.perez@test.com'
    };

    const alumnoMock = {
      nombre: 'Pedrito',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Lopez',
      nombreCompleto: 'Pedrito Perez Lopez',
      fechaNacimiento: new Date('2010-05-15').toISOString(),
      curp: `TS${Date.now()}ABC`,
      sexo: 'M' as const,
      sangre: 'O+',
      nivelId: nivel.nivelId,
      estado: 'ACTIVO' as const,
      tutor: tutorMock
    };

    // 2. Act
    const result = await caller.alumnos.create(alumnoMock);

    // 3. Assert Response
    expect(result.alumnoId).toBeDefined();
    expect(result.matricula).toBeDefined();

    // 4. Assert Database State
    const dbAlumno = await prisma.alumno.findUnique({
      where: { alumnoId: result.alumnoId },
      include: { tutoresAlumnos: { include: { tutor: true } } }
    });

    expect(dbAlumno).not.toBeNull();
    expect(dbAlumno?.curp).toBe(alumnoMock.curp);
  });

  it('debería rechazar si la CURP ya existe', async () => {
    const { ctx } = await createTestContext(['Alumnos']);
    const caller = appRouter.createCaller(ctx);

    const nivel = await prisma.nivelEducativo.upsert({
      where: { codigo: 'SEC_TEST2' },
      update: {},
      create: {
        nombre: 'Secundaria',
        codigo: 'SEC_TEST2',
        orden: 1
      }
    });

    const curpDuplicada = `DP${Date.now()}XYZ`;

    const alumnoMock = {
      nombre: 'Pedrito',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Lopez',
      nombreCompleto: 'Pedrito Perez Lopez',
      fechaNacimiento: new Date('2010-05-15').toISOString(),
      curp: curpDuplicada,
      sexo: 'M' as const,
      sangre: 'O+',
      nivelId: nivel.nivelId,
      estado: 'ACTIVO' as const,
      tutor: {
        nombreCompleto: 'Maria',
        parentesco: 'Madre',
        telefono: '5551234567'
      }
    };

    // Insertamos primero para provocar el duplicado
    await caller.alumnos.create(alumnoMock);

    // Intentamos insertar de nuevo
    await expect(caller.alumnos.create(alumnoMock))
      .rejects.toThrowError(/Ya existe un alumno con ese CURP o Matrícula/);
  });
});
