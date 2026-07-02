import { describe, it, expect, vi } from 'vitest';
import { appRouter } from '../../src/router';
import { createContext } from '../../src/context';

// Para pruebas de integración completas, se recomienda usar una Base de Datos separada 
// y limpiar las tablas antes de cada test. 
// Aquí usamos prismaMock temporalmente como ejemplo de cómo invocar el tRPC caller.

describe('Auth Router (Integration)', () => {
  it('debería fallar validación de Zod si faltan campos', async () => {
    // Simulamos el contexto (req, res sin headers reales)
    const ctx = {
      req: { headers: {} } as any,
      res: {} as any,
      prisma: {} as any,
      token: null
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.auth.login({ correo: 'test', contrasena: '' }))
      .rejects.toThrowError(/Debe ser un correo electrónico válido/); // Zod validation error
  });
});
