# Plan de Pruebas de Integración (End-to-End) - Backend SGA

## 1. Propósito
El propósito de las pruebas de integración es validar la comunicación directa entre nuestra capa de red (TRPC Routers), el ORM (Prisma), la Base de Datos subyacente (PostgreSQL) y módulos de terceros (e.g. JWT y Bcrypt). Garantizan el comportamiento real del sistema en la capa de datos.

## 2. Alcance
Cubre todos los flujos transaccionales críticos en `tests/integration/*`:
- Grafos de creación múltiple (e.g., Crear Ciclo + Nivel + Materia + Grupo).
- Transacciones atómicas seguras en fallos.
- Cruces y Constraints relacionales de base de datos (e.g., llaves foráneas, `ON DELETE CASCADE`, registros únicos).
- Procedimientos de la vida real (Cobranzas, Inscripciones, Calificaciones).

## 3. Estrategia y Entorno
- **Framework**: Vitest (`npm run test:integration`)
- **Base de Datos**: Base de datos de prueba dedicada alojada en Docker (`postgres:1234` BD: `sga_test`). ¡Nunca utilizar la BD de producción ni la de desarrollo directo!
- **Setup y Teardown**: Cada prueba vacía las tablas y resetea las secuencias mediante el hook global inyectado en `vitest.integration.config.ts`.
- **Patrón de Ejecución**: **Síncrono** (`fileParallelism: false`). Se desactivó explícitamente el paralelismo de hilos para evitar condiciones de carrera (Deadlocks `40P01`) en PostgreSQL causadas por la concurrencia de transacciones y vaciados masivos (TRUNCATE).

## 4. Tipos de Casos a Cubrir
1. **Flujos Felices (Happy Paths)**: Pruebas End-To-End de un proceso nominal (ej. Tutor inscribe a su hijo -> Paga Tarifa -> Genera Beca).
2. **Restricciones de BD**: Provocar violaciones estructurales (P2002 Unique Constraint, P2003 Foreign Key Constraint) y verificar que la BD rechaza y el servidor captura la excepción.
3. **Casos Híbridos de Esquema (Zod Refine)**: Validar cómo reacciona el backend ante rechazos Zod complejos que requieren lectura o combinación de campos crudos.
4. **Mapeos Nativos (Tipos SQL)**: Confirmar que tipos complejos como `Decimal` o `JSONB` se inyecten y extraigan hacia TypeScript intactos.

## 5. Criterios de Aceptación
- 100% de los casos de integración deben pasar bajo el comando `npm run test:integration`.
- Cada prueba de integración debe tener un bloque de "Preparación" (Arrange) donde inserten manualmente sus dependencias duras.
- Finalizar sin fugas de memoria o conexiones huérfanas en Prisma.
