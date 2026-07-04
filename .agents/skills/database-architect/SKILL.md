---
name: database-architect
description: Usa esta skill cuando se te pida diseñar, modificar, migrar o revisar esquemas de base de datos, relaciones de tablas, modelos de Prisma o diagramas ER.
---
# Database Architect Skill

Garantiza la solidez de la base de datos PostgreSQL, la normalización de datos y el manejo estricto de migraciones mediante Prisma en el paquete `@sga/data-access`.

## Diseño de Esquema (Prisma)
- Todos los modelos deben ir en `prisma/schema.prisma`.
- Usar UUIDs (`@default(uuid())`) o IDs autoincrementables según se determine la mejor práctica para la tabla en cuestión.
- Definir relaciones explícitas, documentando la justificación de los métodos `onDelete` y `onUpdate` (especialmente para borrados en cascada).

## Convención de Migraciones
- Nunca alterar la base de datos en crudo sin generar y aplicar una migración.
- El formato para los nombres de las migraciones debe ser claro, en minúsculas y descriptivo (ej. `add_students_table`, `update_payment_status`).

## Reglas Críticas
- El frontend `@sga/front-end` y la aplicación Tauri `@sga/app-tauri` NUNCA deben tener dependencias directas al cliente de base de datos.
- Solo `@sga/data-access` y, como consumidor estricto, `@sga/back-end`, pueden interactuar con PostgreSQL.
