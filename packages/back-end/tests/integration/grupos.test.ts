import { describe, it, expect } from 'vitest';
import { appRouter } from '../../src/router';
import { prisma } from '@sga/data-access';
import { createTestContext } from './testUtils';

describe('Grupos Router (Integration)', () => {
  it('debería crear la estructura completa: Nivel, Ciclo, Materia, Grupo y Asignación', async () => {
    const { ctx } = await createTestContext(['Grupos', 'Materias']);
    const caller = appRouter.createCaller(ctx);

    const ts = Date.now().toString().slice(-4); // sufijo corto

    // 1. Crear Nivel Educativo
    const nivelResult = await caller.grupos.createNivel({
      codigo: `P_${ts}`,
      nombre: 'Primaria Test',
      orden: 2
    });
    expect(nivelResult.nivelId).toBeDefined();

    // 1.5 Crear Grado (requerido para Grupo)
    const grado = await prisma.grado.create({
      data: {
        nivelId: nivelResult.nivelId,
        numero: 1,
        nombre: 'Primero'
      }
    });

    // 2. Crear Ciclo Escolar (requiere gradosPermitidos para validación de gap 3)
    const cicloResult = await caller.grupos.createCiclo({
      nombre: `C24-${ts}`,
      fechaInicio: new Date('2024-08-01').toISOString(),
      fechaFin: new Date('2025-07-15').toISOString(),
      activo: true,
      gradosPermitidos: { [nivelResult.nivelId]: [grado.gradoId] }
    });
    expect(cicloResult.cicloId).toBeDefined();

    // 3. Crear Materia
    const materiaResult = await caller.grupos.createMateria({
      nombre: `Matemáticas ${ts}`,
      clave: `MAT-${ts}`
    });
    expect(materiaResult.materiaId).toBeDefined();

    // 4. Crear Grupo
    const grupoResult = await caller.grupos.createGrupo({
      nivelId: nivelResult.nivelId,
      cicloId: cicloResult.cicloId,
      gradoId: grado.gradoId,
      nombre: '1A',
      cupoMaximo: 30
    });
    expect(grupoResult.grupoId).toBeDefined();

    // 5. Asignar Materia al Grupo
    const assignResult = await caller.grupos.assignMateria({
      grupoId: grupoResult.grupoId,
      materiaId: materiaResult.materiaId
    });
    expect(assignResult.grupoMateriaId).toBeDefined();

    // 6. Verificar Estado Final en Base de Datos
    const dbGrupoMateria = await prisma.grupoMateria.findUnique({
      where: { grupoMateriaId: assignResult.grupoMateriaId },
      include: {
        grupo: { include: { nivel: true, ciclo: true } },
        materia: true
      }
    });

    expect(dbGrupoMateria).not.toBeNull();
    expect(dbGrupoMateria?.materia.clave).toBe(`MAT-${ts}`);
    expect(dbGrupoMateria?.grupo.nombre).toBe('1A');
    expect(dbGrupoMateria?.grupo.nivel.codigo).toBe(`P_${ts}`);
    expect(dbGrupoMateria?.grupo.ciclo.nombre).toBe(`C24-${ts}`);
  });

  it('debería rechazar creación de Nivel Educativo si faltan campos requeridos (Zod)', async () => {
    const { ctx } = await createTestContext(['Grupos']);
    const caller = appRouter.createCaller(ctx);

    const invalidNivel = {
      nombre: 'Secundaria'
      // Falta código y orden
    };

    await expect(caller.grupos.createNivel(invalidNivel as any))
      .rejects.toThrowError(/Required|invalid_type/);
  });
});
