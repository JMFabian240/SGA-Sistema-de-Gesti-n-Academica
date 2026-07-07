# Tareas Pendientes: Gaps en el Backend (Colegio San Diego)

Este archivo contiene la lista de tareas técnicas pendientes para corregir los gaps identificados en la auditoría general del backend y base de datos, las cuales se abordarán de forma diferida según las indicaciones del usuario.

## 1. Módulo de Becas y Promociones
- [ ] **Migración de Base de Datos:**
  - [ ] Agregar el campo `matrizPorcentajes Json?` al modelo `Beca` en `schema.prisma`.
  - [ ] Ejecutar la migración con Prisma Migrate (`npx prisma migrate dev`).
- [ ] **Zod Schemas:**
  - [ ] Modificar `createBecaSchema` y `updateBecaSchema` en `becas.schema.ts` para validar la estructura del diccionario `matrizPorcentajes` (claves del tipo `"NivelId_Grado"`, valores entre 0 y 100).
- [ ] **Lógica de Servicio (`becas.service.ts`):**
  - [ ] Implementar la regla de exclusión mutua de becas/promociones: al asignar una promoción de inscripción, verificar que el alumno no posea ya una beca de hermanos activa, y viceversa.
  - [ ] Programar la resolución del porcentaje aplicable basado en el `nivelId` y `grado` del alumno a partir del JSON de la matriz.

## 2. Módulo de Inscripciones (Planes de Pago y Generación de Adeudos)
- [ ] **Servicio de Automatización (`inscripciones.service.ts`):**
  - [ ] Crear la función `generarCalendarioAdeudos(alumnoId, cicloId, planPagoId, grupoId)` para ejecutarse de forma atómica en la transacción de creación de inscripción (`createInscripcion`).
  - [ ] Si se selecciona **Plan 10 Meses**: Crear 10 adeudos consecutivos por concepto de colegiatura con el monto mensual estándar.
  - [ ] Si se selecciona **Plan 12 Meses**: Generar las mensualidades de modo que Diciembre contenga el cargo doble (diciembre + julio) y Julio se cree exento/sin cargo en el calendario.

## 3. Módulo de Calificaciones e Inscripción (Restricciones Académicas)
- [ ] **Validación de Materias Reprobadas:**
  - [ ] Modificar `createInscripcion` para consultar las calificaciones del alumno del ciclo anterior inmediato.
  - [ ] Validar que no tenga ninguna calificación menor a 6.0 (curricular/extracurricular) o `NO_ACREDITADO` (taller). Si existe alguna, arrojar un `TRPCError` indicando la retención por reprobación.

## 4. Módulo de Pagos (Convenios de Pago)
- [ ] **Migración de Base de Datos:**
  - [ ] Crear el modelo `ConvenioPago` en `schema.prisma` (`idConvenio`, `tutorId`, `montoTotalConsolidado`, `fechaCompromiso`, `activo`).
  - [ ] Agregar la relación de clave foránea `convenioId` en el modelo `CalendarioPago`.
  - [ ] Ejecutar la migración con Prisma Migrate.
- [ ] **tRPC Router y Servicios:**
  - [ ] Crear `convenios.router.ts` y `convenios.service.ts`.
  - [ ] Implementar el endpoint `registrarConvenio` que asocie un conjunto de adeudos vencidos a un nuevo convenio de pago, actualizando su estado.
  - [ ] Ajustar la lógica del cobro de recargos automáticos para que ignore los adeudos que tengan un convenio activo y vigente.

## 5. Reportes Financieros
- [ ] **Filtros Dinámicos en Reportes:**
  - [ ] Modificar `ReportesRepository.getDeudores()` para aceptar un parámetro opcional de filtrado (`estadoCobro`).
  - [ ] Permitir la consulta parametrizada para visualizar alumnos "Al Corriente" (PAGADO) e ingresos del día/mes.

## 6. Ajustes de Base de Datos y Zod
- [ ] **Ampliar Conceptos:**
  - [ ] Modificar los límites de longitud de la columna `concepto` en `Tarifa` (`VarChar(15)` -> `VarChar(100)`) y `CalendarioPago` (`VarChar(25)` -> `VarChar(100)`) en `schema.prisma`.
  - [ ] Actualizar los esquemas Zod en `pagos.schema.ts` para admitir conceptos de mayor longitud.
