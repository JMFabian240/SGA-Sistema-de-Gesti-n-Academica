# @sga/data-access

Capa de Acceso a Datos del Sistema de Gestión Académico.
- **Tecnologías**: Prisma ORM.
- **Responsabilidad**: Contiene los modelos (`schema.prisma`), el cliente de conexión a la base de datos PostgreSQL y exporta los tipos generados para ser consumidos por el front-end y back-end.

## Notas importantes
- La conexión a PostgreSQL SOLO existe en este paquete.
- La variable `DATABASE_URL` debe apuntar a la instancia de PostgreSQL portable levantada por Tauri.
