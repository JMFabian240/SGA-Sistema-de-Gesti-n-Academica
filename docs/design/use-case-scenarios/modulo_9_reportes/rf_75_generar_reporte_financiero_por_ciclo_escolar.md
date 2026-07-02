# RF-75: Generar reporte financiero por ciclo escolar

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-75: Generar reporte financiero por ciclo escolar |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Extraer una visión macro de la salud financiera de la institución durante un ciclo lectivo completo. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Reportes.<br>2. Selecciona "Reporte Financiero por Ciclo Escolar".<br>3. El sistema muestra un menú desplegable con los ciclos escolares disponibles<br>4. El actor selecciona el ciclo (ej. 2026-2027) y presiona "Generar"<br>5. El sistema procesa los datos y despliega el resumen: ingresos totales del ciclo, número de alumnos activos y total de pagos realizados.<br>6. El actor exporta el reporte en Excel o PDF. |
| **Flujo Alterno** | <b>A.</b> Ciclo sin aperturar financieramente:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 5, si el ciclo apenas fue creado y no hay colegiaturas ni alumnos procesados, el reporte mostrará totales en cero o arrojará un error de "Datos insuficientes". |
| **Precondiciones** | El ciclo escolar consultado debe estar registrado en el sistema. |
| **Postcondiciones** | El documento consolidado es generado y descargado con éxito. |
| **Reglas de negocio involucradas** | • Este es un reporte de alto nivel que debe mostrar métricas globales (ingresos totales y volumetría de alumnos activos). |
