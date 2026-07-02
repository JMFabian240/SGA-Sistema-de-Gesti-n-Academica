# RF-78: Generar reporte de padres facturables

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-78: Generar reporte de padres facturables |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Emitir un listado global del área de contabilidad con todas las familias que demandan emisión de facturas, sus datos y hábitos de pago. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Reportes.<br>2. Selecciona "Reporte de Padres Facturables".<br>3. El sistema recupera a todos los tutores que tienen activa la casilla de "Requiere factura electrónica", sin pedir parámetros extra.<br>4. El sistema despliega un listado con: nombre, RFC, régimen fiscal, dirección, CURP del alumno asociado y tipo de pago habitual.<br>5. El actor hace clic en "Exportar".<br>6. El sistema descarga el archivo en Excel o PDF para su uso contable. |
| **Flujo Alterno** | <b>A.</b> Base de datos sin facturables:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 3, el sistema detecta que ningún perfil tiene activada esta característica.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. Despliega en pantalla: "No existen padres marcados para facturación". |
| **Precondiciones** | Deben existir tutores registrados que hayan sido configurados mediante el RF-49. |
| **Postcondiciones** | Se obtiene un documento exportado con información lista para ser procesada en portales del SAT externos si es necesario. |
| **Reglas de negocio involucradas** | • El reporte no requiere fechas ni ciclos; extrae el total histórico vigente de perfiles facturables de forma automática. |
