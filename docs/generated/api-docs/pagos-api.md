# Documentación de API - Módulo `pagos`

Este módulo engloba la administración de finanzas y caja. Contempla el catálogo de tarifas, la generación de adeudos (Calendario de Pagos) y el registro robusto de pagos entrantes con aplicación de saldos (RF-55, RF-56, RF-60, RF-61, RF-62).

> **Nota General**: Todos los procedimientos están restingidos (`protectedProcedure`). Las transacciones financieras están envueltas en Prisma `$transaction` para asegurar la atomicidad de los datos.

## Procedimientos

### Tarifas (`tarifa`)
- `pagos.getTarifas` (Query): Obtiene el catálogo de cuotas (colegiaturas, inscripciones, material). Opcionalmente se filtra por `cicloId` y/o `nivelId`.
- `pagos.createTarifa` (Mutation): Genera una nueva cuota base vinculada a un nivel y a un ciclo.
- `pagos.updateTarifa` (Mutation): Modifica el concepto o monto de una cuota base.
- `pagos.deleteTarifa` (Mutation): Soft Delete y desactivación de una cuota (no afecta los adeudos ya generados a los alumnos).

### Adeudos / Calendario de Pago (`calendario_pago`)
- `pagos.getAdeudos` (Query): Consulta el estado de cuenta y plan de pagos particular de un alumno (`alumnoId`). Permite filtrar por estado (ej. `PENDIENTE` o `VENCIDO`).
- `pagos.createAdeudo` (Mutation): Registra una nueva deuda (mensualidad, inscripción) a pagar por un alumno, asignando su fecha límite de pago.
- `pagos.updateAdeudo` (Mutation): Modifica parámetros de un adeudo específico antes de ser pagado.

### Registro de Pago y Caja (`pago`, `aplicacion_pago`, `movimiento_saldo`)
- `pagos.registrarPago` (Mutation): Procedimiento core para procesar un pago entrante.
  - **Inputs**: `alumnoId`, `tutorId`, `fechaPago`, `montoTotal`, `metodoPago`, `aplicaciones` (array indicando cuánto se abonará a qué `calendarioPagoId` en específico).
  - **Comportamiento Transaccional**:
    1. Calcula el total que se pretende aplicar a adeudos existentes a partir del arreglo enviado.
    2. Valida que el `montoTotal` pagado no sea menor a lo que se quiere abonar.
    3. Registra la entrada del `pago` histórico.
    4. Ejecuta cada `aplicacion_pago` y descuenta del `saldoPendiente` del adeudo. Si este llega a cero, cambia el estado a `PAGADO` registrando `liquidadoAt`.
    5. Si el `montoTotal` pagado es **mayor** al monto aplicado (el tutor dio dinero extra), el sobrante se ingresa automáticamente al monedero `saldoAFavor` del Tutor y se genera su correspondiente `movimiento_saldo`.

## Manejo de Errores
- `BAD_REQUEST`: Si el monto del pago no alcanza para cubrir la aplicación, o si se intenta abonar más del saldo pendiente de un adeudo.
- `NOT_FOUND`: Si alguno de los adeudos señalados no existe en el registro del alumno.
