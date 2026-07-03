```markdown
# Especificación de Requerimientos Funcionales - SGA (Calificaciones y Kárdex)

## Módulo 13: Calificaciones (Captura)
| ID | Descripción | Tipo |
| :--- | :--- | :--- |
| RF-13.01 | El administrador debe poder seleccionar los filtros (Ciclo, Grupo, Materia, Periodo) en la interfaz de Captura de Calificaciones, ingresando los valores en los selectores, para cargar la lista de alumnos correspondientes. | Usuario |
| RF-13.02 | El administrador debe poder capturar la calificación de un alumno en la materia seleccionada, ingresando un valor numérico (0 a 10) en la celda del grid, para registrar su evaluación. | Usuario |
| RF-13.03 | El sistema debe poder guardar automáticamente la calificación del alumno, ingresando el valor editado al perder el foco de la celda (on-blur), para persistir la información en la base de datos sin requerir botón de guardado. | Sistema |

## Módulo 13: Calificaciones (Kárdex)
| ID | Descripción | Tipo |
| :--- | :--- | :--- |
| RF-13.04 | El administrador debe poder buscar a un alumno, ingresando su nombre o matrícula (min. 3 letras) en el buscador, para desplegar los resultados coincidentes de alumnos inscritos. | Usuario |
| RF-13.05 | El sistema debe poder consultar el historial académico completo de un alumno seleccionado, ingresando su ID de alumno, para recuperar todas sus calificaciones agrupadas por ciclo escolar. | Sistema |
| RF-13.06 | El administrador debe poder visualizar el kárdex del alumno, ingresando la selección del alumno, para analizar su trayectoria académica (niveles, materias y calificaciones finales). | Usuario |
```
