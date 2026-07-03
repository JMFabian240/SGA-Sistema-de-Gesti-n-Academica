```markdown
| Campo | Descripción Técnica |
| :--- | :--- |
| **1. Autor(es)** | Sistema Generador SGA |
| **2. Nombre del caso de uso** | CU-M13-01: Captura de Calificaciones |
| **3. Actor principal** | Administrador / Docente |
| **4. Objetivo** | Registrar de manera rápida y masiva las calificaciones de un grupo de alumnos para una materia específica. |
| **5. Precondiciones** | - El usuario tiene sesión iniciada y posee los permisos necesarios.<br>- Existen alumnos inscritos en la materia y grupo seleccionados. |
| **6. Postcondiciones** | Las calificaciones de los alumnos quedan persistidas transaccionalmente en la base de datos (PostgreSQL) y vinculadas a su expediente. |
| **7. Flujo principal (Happy Path)** | **1. Actor:** Accede al módulo de Calificaciones > Captura.<br>**2. Sistema:** Carga y muestra los combos de filtrado (Ciclos, Grupos, Materias, Periodos).<br>**3. Actor:** Selecciona Ciclo, Grupo, Materia y Periodo de evaluación.<br>**4. Sistema:** Consulta en BD (`getAlumnosPorGrupo`) las inscripciones correspondientes y las calificaciones existentes para ese periodo.<br>**5. Sistema:** Muestra un DataGrid reactivo con la lista de alumnos y celdas editables para la calificación final.<br>**6. Actor:** Digita una calificación (ej. 9.5) y cambia el foco (tabulación o clic).<br>**7. Sistema:** Intercepta el evento `onBlur`.<br>**8. Sistema:** Invoca la mutación tRPC `upsert` enviando `alumnoId, materiaId, ciclo, calificacion, etc.`<br>**9. Sistema:** Prisma ORM realiza un `upsert` en la tabla `Calificacion`.<br>**10. Sistema:** Muestra un breve indicador visual (Check/Spin) de guardado exitoso por celda sin recargar la página. |
| **8. Flujos alternos** | - **1. Cambio de filtros:** Si el actor cambia el grupo o materia, el sistema reinicia el grid y lanza una nueva consulta. |
| **9. Flujos de excepción** | - **E1. Error de Red/Servidor:** Si falla el `upsert`, el sistema devuelve la celda a su valor original y muestra un Toast/Notificación de error indicando "Fallo al guardar".<br>- **E2. Sin alumnos:** Si el grupo no tiene alumnos, se muestra un *Empty State* "No hay alumnos inscritos". |
| **10. Reglas de negocio** | - R1: La calificación debe ser un valor numérico.<br>- R2: No se requiere un botón "Guardar Todo", el guardado es por celda (auto-save). |
```
