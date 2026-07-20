import { prisma } from '@sga/data-access';
import jwt from 'jsonwebtoken';
import { NivelPermiso } from '@prisma/client';
import { randomBytes } from 'crypto';

export async function createTestContext(modulos: string[] = []) {
  // 1. Asegurar la existencia de un rol ADMIN
  let adminRol = await prisma.rol.findUnique({ where: { codigo: 'ADMIN' } });
  if (!adminRol) {
    adminRol = await prisma.rol.create({
      data: {
        codigo: 'ADMIN',
        nombre: 'Administrador',
        descripcion: 'Rol para testing'
      }
    });
  }

  // 2. Crear usuario único
  const suffix = randomBytes(4).toString('hex');
  const usuario = await prisma.usuario.create({
    data: {
      nombreUsuario: `test_user_${suffix}`,
      nombreCompleto: 'Test User',
      passwordHash: 'fake_hash_test',
      telefono: '5551234567'
    }
  });

  // 3. Asignar rol al usuario
  await prisma.usuarioRol.create({
    data: {
      usuarioId: usuario.usuarioId,
      rolId: adminRol.rolId
    }
  });

  // 4. Asignar permisos a los módulos requeridos
  if (modulos.length > 0) {
    await prisma.usuarioPermisoModulo.createMany({
      data: modulos.map(mod => ({
        usuarioId: usuario.usuarioId,
        modulo: mod,
        nivel: NivelPermiso.LECTURA_Y_ESCRITURA
      }))
    });
  }

  // 5. Crear Token JWT
  const secret = process.env.JWT_SECRET || 'test_secret_integration_key';
  const token = jwt.sign(
    { usuarioId: usuario.usuarioId, rol: 'ADMIN' },
    secret,
    { expiresIn: '1h' }
  );

  return {
    ctx: {
      req: { headers: {}, ip: '127.0.0.1' } as any,
      res: {} as any,
      prisma: prisma,
      token,
      user: { usuarioId: usuario.usuarioId, rol: 'ADMIN' }
    },
    usuario
  };
}
