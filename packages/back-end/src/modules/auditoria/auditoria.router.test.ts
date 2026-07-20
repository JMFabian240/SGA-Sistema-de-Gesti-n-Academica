// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from '../../router';
import { prismaMock } from '../../../tests/setup/prisma-mock';

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(() => ({ usuarioId: 99, jti: 'test-jti' }))
  }
}));

describe('Auditoria Router (Unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.logAuditoria.create.mockResolvedValue({} as any);
    prismaMock.usuarioPermisoModulo.findUnique.mockResolvedValue({
      activo: true,
      nivel: 'LECTURA_Y_ESCRITURA'
    } as any);
  });

  const ctxMock = {
    prisma: prismaMock as any,
    user: { usuarioId: 99, jti: 'test-jti' },
    req: {} as any,
    res: {} as any,
    token: 'fake-token'
  };

  const caller = appRouter.createCaller(ctxMock as any);

  describe('obtenerLogs', () => {
    it('debería retornar datos parseados a string y metadatos correctos', async () => {
      prismaMock.logAuditoria.count.mockResolvedValue(150);
      prismaMock.logAuditoria.findMany.mockResolvedValue([
        {
          logId: BigInt(123456789),
          usuarioId: 1,
          accion: 'UPDATE',
          tablaAfectada: 'usuarios.crearUsuario',
          fechaHora: new Date(),
          descripcion: 'Ejecución exitosa',
          usuario: { nombreUsuario: 'admin', nombreCompleto: 'Admin Test' }
        }
      ] as any);

      const result = await caller.auditoria.obtenerLogs({ pagina: 2, limite: 50 });

      expect(prismaMock.logAuditoria.count).toHaveBeenCalled();
      expect(prismaMock.logAuditoria.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 50, // (2 - 1) * 50
        take: 50,
        orderBy: { fechaHora: 'desc' }
      }));
      
      // Validación crucial: BigInt convertido a String
      expect(result.data[0].logId).toBe('123456789');
      expect(typeof result.data[0].logId).toBe('string');
      
      expect(result.meta.total).toBe(150);
      expect(result.meta.totalPaginas).toBe(3);
    });

    it('debería construir el where clause dinámicamente con los filtros', async () => {
      prismaMock.logAuditoria.count.mockResolvedValue(0);
      prismaMock.logAuditoria.findMany.mockResolvedValue([] as any);

      const fechaInicio = '2023-01-01T00:00:00.000Z';
      const fechaFin = '2023-12-31T23:59:59.000Z';

      await caller.auditoria.obtenerLogs({
        pagina: 1,
        limite: 10,
        usuarioId: 5,
        accion: 'INSERT',
        fechaInicio,
        fechaFin
      });

      const expectedWhere = {
        usuarioId: 5,
        accion: 'INSERT',
        fechaHora: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin)
        }
      };

      expect(prismaMock.logAuditoria.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expectedWhere
      }));
    });
  });
});
