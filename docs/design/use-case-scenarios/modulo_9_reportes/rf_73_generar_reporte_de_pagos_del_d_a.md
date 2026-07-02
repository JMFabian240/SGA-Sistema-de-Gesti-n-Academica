# RF-73: Generar reporte de pagos del día

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-73: Generar reporte de pagos del día |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Emitir un corte de caja rápido que liste todos los ingresos registrados durante la jornada actual, facilitando el cuadre de caja sin parámetros complejos. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Reportes.<br>2. Hace clic en la opción "Reporte de pagos del día".<br>3. El sistema recopila automáticamente los pagos registrados en la fecha actual (del sistema).<br>4. El sistema despliega un desglose en pantalla con: nombre de alumno, monto pagado, método de pago y el total global del día.<br>5. El actor selecciona "Exportar" y elige Excel o PDF.<br>6. El sistema descarga el archivo en el formato elegido. |
| **Flujo Alterno** | <b>A.</b> Ningún pago registrado:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 3, el sistema detecta que no hay transacciones en el día de hoy.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra el mensaje: "No hay pagos registrados para la fecha actual".<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El actor regresa al panel principal. |
| **Precondiciones** | El actor debe tener sesión activa. Deben existir pagos capturados en la fecha en la que se solicita el reporte. |
| **Postcondiciones** | El reporte se visualiza en pantalla o se descarga como archivo físico (Excel/PDF). |
| **Reglas de negocio involucradas** | • La generación de este reporte no debe exigir parámetros adicionales; toma automáticamente la fecha del día en curso.<br>• Debe incluir obligatoriamente el método de pago para el cotejo bancario. |
