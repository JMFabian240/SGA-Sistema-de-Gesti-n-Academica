---
name: sga-testing-workflow
description: >
  Instrucciones para ejecutar pruebas unitarias y de integración en el backend
  de SGA, así como convenciones para almacenar reportes de pruebas generados.
---

# Skill: SGA Testing Workflow

Cuando tengas que correr pruebas de backend o guardar evidencia/reportes de las pruebas en el proyecto SGA, sigue estas reglas:

### 1. Comandos de Pruebas Backend
El backend de SGA utiliza la siguiente configuración para las pruebas (se ejecutan dentro de `packages/back-end`):
- **Pruebas Unitarias**: `npm run test` (Utilizan el mock de Prisma configurado en `tests/setup/prisma-mock.ts`).
- **Pruebas de Integración**: `npm run test:integration` (Pruebas E2E que se ejecutan directamente contra la base de datos de pruebas local de PostgreSQL, normalmente llamada `sga_test`).

### 2. Almacenamiento de Reportes
- Todos los reportes generados como artefactos después de correr o documentar las suites de pruebas (unitarias o de integración) deben guardarse bajo el directorio: `docs/generated/test-reports/` en la raíz del proyecto.
- Si hay varios reportes de un mismo tipo (ej. múltiples reportes unitarios o de integración), se debe crear un subdirectorio correspondiente para ese tipo de pruebas:
  - `docs/generated/test-reports/unit/`
  - `docs/generated/test-reports/integration/`
- Usa nombres de archivo descriptivos con fecha para los reportes si aplica (ej. `reporte-unitario-2026-07-22.md`).
