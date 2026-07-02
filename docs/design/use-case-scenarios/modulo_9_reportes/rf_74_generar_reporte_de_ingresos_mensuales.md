# RF-74: Generar reporte de ingresos mensuales

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-74: Generar reporte de ingresos mensuales |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Obtener un resumen estructurado y exportable de todos los ingresos generados durante un mes específico para control financiero. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Reportes.<br>2. Selecciona la opción "Reporte de Ingresos Mensuales".<br>3. El sistema solicita los parámetros de "Mes" y "Año".<br>4. El actor selecciona los parámetros deseados (ej. octubre<br>2026. ) y presiona "Generar".<br>5. El sistema consolida la información y despliega un resumen con el desglose de pagos por alumno y la suma total del periodo.<br>6. El actor exporta el documento en Excel o PDF. |
| **Flujo Alterno** | <b>A.</b> Selección de mes futuro sin registros:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 4, el actor selecciona un mes que aún no ha ocurrido.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema emite un reporte vacío indicando un monto total de $0.00. |
| **Precondiciones** | El sistema debe tener acceso a la base de datos histórica de pagos. |
| **Postcondiciones** | Se genera un archivo descargable con el desglose mensual. |
| **Reglas de negocio involucradas** | • El reporte mensual debe permitir el desglose por alumno para auditar qué cuentas generaron ingresos en el mes consultado. |
