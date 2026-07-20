---
name: safe-prisma-transformers
description: Implementa una capa de transformación entre Prisma y el frontend convirtiendo tipos especiales (como Decimal) en tipos de TypeScript nativos.
---

# Safe Prisma Transformers Skill

## Propósito
Evita incompatibilidades de tipado (ej. `TS2345`) en el frontend asegurando que el backend no retorne tipos específicos del ORM de Prisma (como clases `Decimal` o referencias raras). Obliga a definir una capa DTO (Data Transfer Object) clara.

## Cuándo usar
Utiliza esta skill cuando crees un nuevo servicio o router de tRPC que necesite exponer datos hacia el frontend, en especial si los datos incluyen campos de moneda o numéricos exactos (Prisma `Decimal`).

## Procedimiento
1. **Detección:** Revisa los métodos expuestos en `packages/back-end/src/modules/*/`.
2. **Crear Funciones Mappers:** Si devuelves entidades complejas, crea funciones utilitarias (ej. `mapPagoToDTO(pago: Pago)`) en el backend.
3. **Conversión Estricta:**
   - Para campos `Decimal` de Prisma, transfórmalos usando `.toNumber()`.
   - Para fechas problemáticas, transfórmalas usando `.toISOString()`.
4. **Actualizar el Router:** Asegúrate de que los métodos de `router.ts` llamen al mapper antes de retornar la data al frontend.
