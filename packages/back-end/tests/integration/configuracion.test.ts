import { describe, it, expect } from 'vitest';
import { appRouter } from '../../src/router';
import { prisma } from '@sga/data-access';
import { createTestContext } from './testUtils';

describe('Configuracion Router (Integration)', () => {
  it('debería auto-crear la configuración por defecto si la base de datos está vacía', async () => {
    const { ctx } = await createTestContext(['Configuracion']);
    const caller = appRouter.createCaller(ctx);

    // Act
    const configResult = await caller.configuracion.get();

    // Assert
    expect(configResult.configuracionId).toBe(1);
    expect(configResult.montoRecargoDefecto).toBeDefined(); 
    expect(configResult.diasGraciaRecargo).toBeDefined();
    expect(configResult.plazoInscripcionDias).toBeDefined();
    expect(Array.isArray(configResult.umbralesSmtpDias)).toBe(true);

    // Verificar Persistencia
    const dbConfig = await prisma.configuracionGlobal.findUnique({
      where: { configuracionId: 1 }
    });
    
    expect(dbConfig).not.toBeNull();
  });

  it('debería actualizar la configuración correctamente procesando JSON y Decimal', async () => {
    const { ctx } = await createTestContext(['Configuracion']);
    const caller = appRouter.createCaller(ctx);

    // Forzamos que exista antes para probar el update (aunque get y update ya lo hacen interno)
    const updateInput = {
      montoRecargoDefecto: 550.50,
      diasGraciaRecargo: 3,
      umbralesSmtpDias: [7, 4, 2, 1]
    };

    const updatedConfig = await caller.configuracion.update(updateInput);

    expect(updatedConfig.montoRecargoDefecto).toBe(550.5);
    expect(updatedConfig.diasGraciaRecargo).toBe(3);
    expect(updatedConfig.umbralesSmtpDias).toEqual([7, 4, 2, 1]);

    // Validar Persistencia Real
    const dbConfig = await prisma.configuracionGlobal.findUnique({
      where: { configuracionId: 1 }
    });

    expect(dbConfig?.montoRecargoDefecto.toNumber()).toBe(550.5);
    expect(dbConfig?.umbralesSmtpDias).toEqual([7, 4, 2, 1]);
  });

  it('debería rechazar si la validación de Zod falla (números negativos)', async () => {
    const { ctx } = await createTestContext(['Configuracion']);
    const caller = appRouter.createCaller(ctx);

    const invalidInput = {
      montoRecargoDefecto: -100 // Inválido
    };

    await expect(caller.configuracion.update(invalidInput))
      .rejects.toThrowError(/El monto del recargo no puede ser negativo|too_small/);
  });
});
