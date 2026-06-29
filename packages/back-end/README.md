# @sga/back-end

Capa de Backend Empaquetada del Sistema de Gestión Académico.
- **Tecnologías**: Fastify, tRPC, Zod.
- **Acceso a Datos**: Importa `@sga/data-access` para interactuar con la base de datos a través de Prisma.
- **Distribución**: Compilado como ejecutable independiente (Node sidecar) que es orquestado por Tauri.

## Notas importantes
- Es arrancado por Tauri DESPUÉS de que PostgreSQL está activo.
- Es detenido de forma segura al cerrar la aplicación de escritorio.
