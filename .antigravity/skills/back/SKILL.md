---
name: Backend tRPC Pattern (SGA)
description: Patrones de arquitectura y reglas base para el desarrollo de módulos en el backend del Colegio San Diego (@sga/back)
---

# Reglas Arquitectónicas de `@sga/back`

Este archivo describe el estándar de desarrollo a seguir en la capa de Backend (Fastify + tRPC + Zod + Prisma).

## 1. Estructura de Módulo
Cada nuevo módulo debe incluir exactamente 3 archivos en su directorio (`src/modules/[nombre]/`):
- `[nombre].schema.ts`: Define las validaciones de Zod. Es la **única** capa donde Zod es utilizado para validar input.
- `[nombre].service.ts`: Contiene toda la lógica de negocio pura. No debe depender de Fastify ni de tRPC (no importa `ctx` ni request). Únicamente lanza errores usando `TRPCError` (por conveniencia de tRPC) o errores nativos. Es la **única** capa que interactúa directamente con Prisma.
- `[nombre].router.ts`: Define las rutas de tRPC (`publicProcedure` o `protectedProcedure`). Resuelve parámetros desde `ctx` e `input`, y delega inmediatamente la lógica a métodos del Service.

## 2. Acceso a Datos (Prisma)
- **Prohibido el acceso directo desde el Router**: El router *nunca* puede llamar a `prisma.findMany()`, `prisma.create()`, etc. Todo acceso a base de datos debe estar encapsulado en el Service.
- **Transacciones**: Si una operación modifica múltiples tablas, debe usarse `$transaction`.
- **Soft Delete Obligatorio**: Nunca uses `delete` ni `deleteMany`. Si un registro se elimina, debe actualizarse el campo `eliminadoEn` a `new Date()`.

## 3. Autenticación y Autorización
- El middleware `isAuthed` decodifica el JWT del header `Authorization`.
- Este middleware también verifica automáticamente en la base de datos que el `jti` del token no haya sido revocado en la tabla `TokenRevocado`.
- El payload del token expone `usuarioId`, `nombreUsuario` y `jti`.
- Las mutaciones y queries restringidas deben usar `protectedProcedure`.

## 4. Manejo de Errores
- Para fallos esperados, lanzar `TRPCError` con los códigos:
  - `BAD_REQUEST` para lógica de negocio rota (ej. saldo insuficiente).
  - `UNAUTHORIZED` o `FORBIDDEN` para reglas de acceso.
  - `NOT_FOUND` cuando el Service no encuentra el registro en Prisma.
- Nunca usar `any`. Todos los tipos deben ser inferidos o explícitamente declarados.
