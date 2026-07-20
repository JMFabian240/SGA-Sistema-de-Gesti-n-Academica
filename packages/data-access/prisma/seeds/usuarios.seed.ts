import { PrismaClient } from '@prisma/client';
import { UsuariosService } from '../../../back-end/src/modules/usuarios/usuarios.service';
import { UsuariosRepository } from '../../../back-end/src/modules/usuarios/usuarios.repository';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de usuarios a través de UsuariosService...');

  // Roles requeridos
  const rolesData = [
    { codigo: 'ADMIN', nombre: 'Administrador' },
    { codigo: 'GESTOR', nombre: 'Gestor' },
    { codigo: 'DOCENTE', nombre: 'Docente' },
  ];

  const rolesMap = new Map();
  for (const r of rolesData) {
    const rol = await prisma.rol.upsert({
      where: { codigo: r.codigo },
      update: {},
      create: r,
    });
    rolesMap.set(r.codigo, rol.rolId);
  }

  const nombres = ['Harry', 'Luis', 'Diana', 'Jessica', 'Pako'];

  const rolesParaAsignar = [
    { rol: 'ADMIN', inicial: 'a' },
    { rol: 'GESTOR', inicial: 'g' },
    { rol: 'DOCENTE', inicial: 'd' }
  ];

  // Identificador genérico para auditoría en seeds (nulo porque no hay usuarios aún)
  const ACTOR_SISTEMA_ID = null as any;

  for (const nombre of nombres) {
    for (const r of rolesParaAsignar) {
      const nombreUsuario = `${nombre.toLowerCase()}.${r.inicial}`;
      const rolId = rolesMap.get(r.rol);
      
      if (!rolId) continue;

      const existente = await UsuariosRepository.findByUsername(nombreUsuario);

      if (!existente) {
        // Validación 1: Crear usuario usando el servicio del backend
        await UsuariosService.crearUsuario({
          nombreUsuario,
          nombreCompleto: nombre,
          password: 'sandiego',
          rolId: rolId
        }, ACTOR_SISTEMA_ID);

        console.log(`Usuario creado (validando backend): ${nombreUsuario}`);
        
        // Quitar la bandera obligatoria de cambio de contraseña para facilitar pruebas
        const nuevoUsuario = await UsuariosRepository.findByUsername(nombreUsuario);
        if (nuevoUsuario) {
            await prisma.usuario.update({
                where: { usuarioId: nuevoUsuario.usuarioId },
                data: { debeCambiarPwd: false }
            });
        }

      } else {
        // Validación 2: Asignar y actualizar roles y permisos mediante el servicio
        await UsuariosService.asignarRoles({
          usuarioId: existente.usuarioId,
          roles: [rolId]
        }, ACTOR_SISTEMA_ID);

        // Validación 3: Actualizar contraseña con el servicio
        await UsuariosService.actualizarPasswordUsuario({
          usuarioId: existente.usuarioId,
          nuevaPassword: 'sandiego'
        });

        // Asegurar que no deba cambiar la contraseña en las pruebas
        await prisma.usuario.update({
            where: { usuarioId: existente.usuarioId },
            data: { debeCambiarPwd: false, activo: true }
        });

        console.log(`Usuario actualizado (validando backend): ${nombreUsuario}`);
      }
    }
  }

  console.log('Seed de usuarios finalizada con validación de servicios.');
}

main()
  .catch((e) => {
    console.error('Error durante la seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
