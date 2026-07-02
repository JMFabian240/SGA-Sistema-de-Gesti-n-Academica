import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auditMiddleware, router, publicProcedure, t } from './trpc';
import { prismaMock } from '../tests/setup/prisma-mock';

describe('Audit Middleware (Unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore: PrismaMock deep proxy causa referencia circular en TS
    (prismaMock.logAuditoria.create as any).mockResolvedValue({});
  });

  // Simulamos un router aplicando el middleware de auditoría a todos sus procedimientos
  const dummyRouter = router({
    queryTest: publicProcedure.use(auditMiddleware).query(() => ({ ok: true })),
    crearAlgo: publicProcedure.use(auditMiddleware).mutation(() => ({ ok: true })),
    eliminarAlgo: publicProcedure.use(auditMiddleware).mutation(() => ({ ok: true })),
    actualizarAlgo: publicProcedure.use(auditMiddleware).mutation(() => ({ ok: true })),
    fallidaAlgo: publicProcedure.use(auditMiddleware).mutation(() => {
      throw new Error('Error forzado');
    }),
  });

  const createCallerWithUser = (userMock: any) => {
    return dummyRouter.createCaller({
      prisma: prismaMock as any,
      user: userMock,
      req: { ip: '127.0.0.1' } as any,
      res: {} as any,
      token: 'fake'
    } as any);
  };

  it('no debería registrar logs para operaciones tipo query', async () => {
    const caller = createCallerWithUser({ usuarioId: 1 });
    await caller.queryTest();
    expect(prismaMock.logAuditoria.create).not.toHaveBeenCalled();
  });

  it('no debería registrar logs para mutaciones fallidas', async () => {
    const caller = createCallerWithUser({ usuarioId: 1 });
    await expect(caller.fallidaAlgo()).rejects.toThrow();
    expect(prismaMock.logAuditoria.create).not.toHaveBeenCalled();
  });

  it('no debería registrar logs si no hay usuario en el contexto', async () => {
    const caller = createCallerWithUser(null);
    await caller.crearAlgo();
    expect(prismaMock.logAuditoria.create).not.toHaveBeenCalled();
  });

  it('debería inferir INSERT si el path incluye crear', async () => {
    const caller = createCallerWithUser({ usuarioId: 1 });
    await caller.crearAlgo();
    
    expect(prismaMock.logAuditoria.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ accion: 'INSERT', tablaAfectada: 'crearAlgo' })
    }));
  });

  it('debería inferir DELETE si el path incluye borrar o eliminar', async () => {
    const caller = createCallerWithUser({ usuarioId: 1 });
    await caller.eliminarAlgo();
    
    expect(prismaMock.logAuditoria.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ accion: 'DELETE', tablaAfectada: 'eliminarAlgo' })
    }));
  });

  it('debería inferir UPDATE por defecto', async () => {
    const caller = createCallerWithUser({ usuarioId: 1 });
    await caller.actualizarAlgo();
    
    expect(prismaMock.logAuditoria.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ accion: 'UPDATE', tablaAfectada: 'actualizarAlgo' })
    }));
  });
});
