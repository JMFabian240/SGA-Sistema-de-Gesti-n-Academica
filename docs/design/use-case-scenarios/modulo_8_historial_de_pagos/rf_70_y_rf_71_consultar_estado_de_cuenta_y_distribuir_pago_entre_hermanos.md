# RF-70 y RF-71: Consultar estado de cuenta y distribuir pago entre hermanos

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-70 y RF-71: Consultar estado de cuenta y distribuir pago entre hermanos |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Permitir la visualización consolidada de la deuda de una familia y registrar un único comprobante de pago que liquide adeudos de diferentes alumnos asociados al mismo tutor simultáneamente. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Pagos.<br>2. Selecciona la opción de consultar por "Tutor / Familia".<br>3. Ingresa el nombre del tutor o de cualquiera de sus alumnos vinculados.<br>4. El sistema muestra el estado de cuenta consolidado, enlistando todos los adeudos pendientes agrupados por cada hermano.<br>5. El actor hace clic en "Registrar Pago Múltiple".<br>6. El sistema permite al actor seleccionar (palomear) los conceptos que el tutor desea liquidar, incluso si pertenecen a diferentes hijos.<br>7. El actor ingresa el monto total recibido, fecha y método de pago (Transferencia, Tarjeta, Depósito) y adjunta el comprobante digital único.<br>8. Hace clic en "Procesar Pago".<br>9. El sistema liquida todos los conceptos seleccionados distribuyendo el monto, actualiza el estado de cada adeudo, vincula el mismo comprobante a todos ellos y genera un único recibo desglosado. |
| **Flujo Alterno** | <b>A.</b> Monto insuficiente:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 8, el sistema detecta que el monto total ingresado es menor a la suma de los conceptos seleccionados.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra una alerta indicando el faltante.<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El actor ajusta los conceptos seleccionados o corrige el monto ingresado para que cuadre exactamente y reintenta. |
| **Precondiciones** | El tutor debe existir y tener al menos un alumno vinculado con adeudos pendientes. El actor debe tener sesión iniciada. |
| **Postcondiciones** | El estado de cuenta familiar se actualiza. Los recibos y registros se vinculan exitosamente, marcando los adeudos seleccionados como pagados. |
| **Reglas de negocio involucradas** | Todos los alumnos liquidados en la transacción deben estar forzosamente vinculados al mismo perfil de Padre/Tutor. |
