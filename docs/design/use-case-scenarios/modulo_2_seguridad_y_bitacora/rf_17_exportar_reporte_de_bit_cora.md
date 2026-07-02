# RF-17: Exportar reporte de bitácora

| Campo | Descripción |
| :---- | :---- |
| **Nombre** | RF-17: Exportar reporte de bitácora |
| **Actor** | Administrador |
| **Objetivo** | Filtrar y transformar los registros de la bitácora en un archivo digital estructurado y descargarlo al equipo local. |
| **Flujo Principal** | 1. El Administrador, desde la vista del historial (RF-09), hace clic en "Exportar historial".<br>2. El Sistema despliega un panel de filtros opcionales: rango de fechas y/o usuario específico.<br>3. El Administrador define los filtros y selecciona el formato (Excel o PDF).<br>4. El Administrador confirma haciendo clic en "Generar".<br>5. El Sistema aplica los filtros sobre la tabla de bitácora.<br>6. El Sistema procesa la solicitud y genera el documento en el formato elegido.<br>7. El Sistema inicia la descarga del archivo en el equipo. |
| **Flujo Alterno** | <b>A.</b> Error de generación:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 6, el Sistema falla al renderizar el archivo.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El Sistema muestra: "Error al generar el documento. Intente nuevamente".<br><br><b>B.</b> Filtros sin resultados:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 5, no se encuentran registros con los filtros seleccionados.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El Sistema muestra: "No se encontraron registros con los filtros aplicados". |
| **Precondiciones** | El Administrador debe estar en la pantalla de bitácora con el historial cargado (RF-09). |
| **Postcondiciones** | Un archivo con el reporte de auditoría filtrado es descargado y guardado en el equipo del Administrador. |
| **Reglas de negocio involucradas** | • La exportación permite filtrar por rango de fechas y/o usuario antes de generar.<br>• El formato de salida debe ser Excel o PDF con contenido idéntico en ambos (RNF-27). |
