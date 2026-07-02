---
name: data-access
description: Reglas y patrones para desarrollar en el paquete @sga/data-access. Activar al modificar el esquema de la base de datos o el cliente ORM.
---

# Data-Access Skill (@sga/data-access)

Guía para mantener la única fuente de verdad de conexión de base de datos.

## Tecnologías Principales

- **Prisma ORM** para modelado y consultas.
- **PostgreSQL portable** como motor subyacente.

## Convenciones y Estructura

- `schema.prisma` contiene todos los modelos.
- Los modelos deben estar en PascalCase singular (`User`, no `users`).
- Las migraciones generadas con `prisma migrate dev` deben tener nombres cortos y descriptivos en minúsculas y guiones (ej: `add-role-to-user`).
- El cliente Prisma (`PrismaClient`) debe exportarse como un Singleton global para evitar agotar conexiones en desarrollo, pero en este monorepo el binario es empaquetado; aún así es buena práctica centralizar la instancia en `client.ts`.

## Reglas y Prohibiciones

- **PROHIBIDO**: Tener lógica de negocio, endpoints, tRPC o dependencias de UI en este paquete. Este paquete solo sabe sobre datos.
- **OBLIGATORIO**: Este paquete es el ÚNICO lugar del monorepo donde está permitida la importación de `@prisma/client` y la variable de entorno `DATABASE_URL`.

## Ejemplo Mínimo de un Modelo Correcto

**`schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
}
```

**`client.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```
