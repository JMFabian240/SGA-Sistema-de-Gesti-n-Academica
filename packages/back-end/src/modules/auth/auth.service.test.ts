import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { prismaMock } from '../../../tests/setup/prisma-mock';
import bcrypt from 'bcryptjs';
import { TRPCError } from '@trpc/server';

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  }
}));

describe('AuthService (Unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('debería rechazar si el usuario no existe', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);
      prismaMock.intentoLogin.create.mockResolvedValue({} as any);

      await expect(AuthService.login({ correo: 'no@existe.com', contrasena: '123' }, '127.0.0.1', 'test'))
        .rejects.toThrowError(new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales inválidas' }));
    });

    it('debería retornar token si el password es correcto', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue({
        usuarioId: 1,
        nombreUsuario: 'testuser',
        nombreCompleto: 'Test User',
        correo: 'test@sga.com',
        activo: true,
        eliminadoEn: null,
        bloqueadoHasta: null,
        intentosFallidos: 0,
        passwordHash: 'hash',
        roles: [{ rol: { nombre: 'ADMIN' } }],
        debeCambiarPwd: false
      } as any);

      (bcrypt.compare as any).mockResolvedValue(true);
      prismaMock.usuario.update.mockResolvedValue({} as any);
      prismaMock.intentoLogin.create.mockResolvedValue({} as any);

      const result = await AuthService.login({ correo: 'test@sga.com', contrasena: '123' }, '127.0.0.1', 'test');

      expect(result).toHaveProperty('token');
      expect(result.usuario).toEqual({
        id: 1,
        nombre: 'Test User',
        roles: ['ADMIN'],
        debeCambiarPwd: false
      });
    });
  });
});
