import 'dotenv/config';
import { buildServer } from './server';
import { initCronRecargos } from './cron/recargos.cron';
import { execSync } from 'child_process';
import path from 'path';
import { prisma } from '@sga/data-access';
import bcrypt from 'bcryptjs';

const server = buildServer();
const PORT = Number(process.env.TRPC_PORT) || Number(process.env.PORT) || 3001;

async function runInitialSeeder() {
  try {
    const usersCount = await prisma.usuario.count();
    if (usersCount === 0) {
      console.log('Base de datos vacía detectada. Creando datos iniciales por defecto...');
      
      // Crear roles esenciales
      let rolAdmin = await prisma.rol.findUnique({ where: { codigo: 'ADMIN' } });
      if (!rolAdmin) {
        rolAdmin = await prisma.rol.create({ data: { codigo: 'ADMIN', nombre: 'Administrador' } });
      }
      
      const rolesExtra = [
        { codigo: 'GESTOR', nombre: 'Gestor' },
        { codigo: 'DOCENTE', nombre: 'Docente' }
      ];
      
      for (const rol of rolesExtra) {
        const existe = await prisma.rol.findUnique({ where: { codigo: rol.codigo } });
        if (!existe) {
          await prisma.rol.create({ data: rol });
        }
      }

      // Crear admin user
      const passwordHash = await bcrypt.hash('admin', 10);
      const usuario = await prisma.usuario.create({
        data: {
          nombreUsuario: 'admin',
          nombreCompleto: 'Administrador General',
          passwordHash,
          activo: true,
          debeCambiarPwd: false,
        },
      });

      // Asignar rol ADMIN
      await prisma.usuarioRol.create({
        data: {
          usuarioId: usuario.usuarioId,
          rolId: rolAdmin.rolId,
          activo: true,
        },
      });
      console.log('✅ Usuario Super Administrador creado exitosamente (User: admin / Pass: admin)');
    }
  } catch (error) {
    console.error('Error durante el seeder inicial:', error);
  }
}

async function start() {
  try {
    // Ejecutar migraciones si se solicita
    if (process.env.NODE_ENV === 'production' || process.env.RUN_MIGRATIONS === 'true') {
      console.log('Ejecutando migraciones de base de datos...');
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('Migraciones completadas correctamente.');
      } catch (migrationError) {
        console.error('Error ejecutando migraciones:', migrationError);
        process.exit(1);
      }
    }

    // Ejecutar seeder de datos iniciales
    await runInitialSeeder();

    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    
    // Iniciar tareas programadas
    initCronRecargos();

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
