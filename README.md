# SGA (Sistema de Gestión Académico)

Este es un monorepo para el Sistema de Gestión Académico "SGA".
Utiliza una arquitectura "Todo en Uno" con Tauri Sidecars para ser distribuido como un único instalable sin requerir Docker, Node.js ni PostgreSQL preinstalados en el equipo del usuario.

## Estructura de paquetes

- `@sga/front-end`: Interfaz de usuario (Vite + React + TypeScript).
- `@sga/back-end`: Servidor HTTP (Fastify + tRPC). Se compila como ejecutable independiente (sidecar).
- `@sga/data-access`: Acceso a datos (Prisma ORM). Único punto de conexión con la base de datos PostgreSQL.
- `@sga/app-tauri`: Contenedor de escritorio (Tauri). Orquesta PostgreSQL y el backend como sidecars.

## Requisitos para desarrollo

1. **Node.js** (v18+)
2. **Rust** y dependencias para Tauri (v2)
3. **PostgreSQL portable**: Debes obtener los binarios de PostgreSQL para Windows (`initdb.exe`, `postgres.exe`, `pg_ctl.exe` y sus DLLs) y colocarlos en la carpeta `packages/app-tauri/src-tauri/binaries/`. Nota: Cambiarles el nombre según tu configuración en `tauri.conf.json` (ej: `initdb-x86_64-pc-windows-msvc.exe`).

## Entorno de Desarrollo

1. Crea un archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Levanta la aplicación en desarrollo:
   ```bash
   npm run dev:tauri
   ```
