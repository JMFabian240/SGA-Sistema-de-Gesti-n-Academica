---
name: back
description: Reglas y patrones para desarrollar en el paquete @sga/back-end. Activar al crear o modificar lógica del servidor, API y rutas de Fastify o tRPC.
---

# Back-End Skill (@sga/back-end)

Guía para mantener la consistencia y arquitectura en el servidor (Node sidecar).

## Tecnologías Principales

- **Fastify** como servidor HTTP base.
- **tRPC** para definir y exponer los procedimientos (API).
- **Zod** para validación de datos de entrada (inputs) y salida (outputs).

## Convenciones y Estructura

- Los routers (procedimientos tRPC) deben dividirse lógicamente por dominio o recurso (ej: `usuariosRouter`, `cursosRouter`).
- Concentra los routers secundarios en un `appRouter` principal.
- Delega el acceso a la base de datos al paquete `@sga/data-access`.

## Reglas y Prohibiciones

- **PROHIBIDO**: Configurar conexiones directas a PostgreSQL (usando `pg` o instanciando Prisma aquí). La conexión solo existe en `@sga/data-access`.
- **PROHIBIDO**: Retornar errores o instancias genéricas sin tipar. Siempre maneja errores y lanza excepciones `TRPCError` apropiadas.
- **PERMITIDO**: Importar `prisma` (el cliente instanciado) y los tipos desde `@sga/data-access`.

## Validación con Zod y Definición de Procedimientos tRPC

- Usa `zod` para el `.input()` de cada procedimiento.
- Distingue entre `publicProcedure` y procedimientos protegidos/autenticados, si los hay.

## Ejemplo Mínimo de un Procedimiento Correcto

**`usuariosRouter.ts`**

```typescript
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@sga/data-access';
import { TRPCError } from '@trpc/server';

export const usuariosRouter = router({
  listar: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  }),
  
  crear: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(2),
    }))
    .mutation(async ({ input }) => {
      try {
        const nuevoUsuario = await prisma.user.create({
          data: input,
        });
        return nuevoUsuario;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al crear el usuario',
        });
      }
    }),
});
```
