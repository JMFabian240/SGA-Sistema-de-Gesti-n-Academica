---
name: sga-domain-logic
description: >
  Reglas de negocio específicas del dominio SGA (Pagos, Becas, Ciclos, Tutores)
  y efectos en cascada que deben respetarse. Úsala cuando modifiques lógica o base
  de datos relacionada con estos procesos del negocio.
---

# Skill: SGA Domain Logic (Reglas de Negocio en Cascada)

Cuando el usuario solicite cambios en la lógica de negocio del SGA (creación, edición o eliminación de registros), debes cumplir estrictamente con la consistencia en cascada de las siguientes reglas de negocio:

### 1. Registro de Pagos
Toda edición en las tablas `Pago`, `AplicacionPago`, `CalendarioPago` o `Tutor` (saldo a favor) debe mantener la atomicidad transaccional de caja en el método `registrarPagoTransaccion` de `packages/back-end/src/modules/pagos/pagos.repository.ts`.
- Nunca actualices estas entidades por separado si corresponden a una misma transacción física de caja.

### 2. Solicitudes de Beca
La aprobación de becas implica la inserción atómica de `AsignacionBeca` dentro del método transaccional `resolverSolicitudConAsignacion` de `packages/back-end/src/modules/becas/becas.repository.ts`.

### 3. Activación de Ciclos Escolares
Al activar un ciclo escolar (usualmente en `packages/back-end/src/modules/grupos/grupos.repository.ts`), se debe desactivar en cascada (`updateMany`) los demás ciclos vigentes que tengan la misma periodicidad (para que no haya dos ciclos activos compitiendo).

### 4. Mantenimiento Alumno-Tutor
- **Tutor Principal**: Vincular un tutor como principal DEBE remover la bandera `esPrincipal` de cualquier otro tutor previamente vinculado a ese alumno.
- **Baja de Tutor**: Dar de baja a un tutor exige validar previamente que NO tenga `saldoAFavor > 0`. Si tiene saldo a favor, se debe rechazar la operación con un error claro.
