# RF-82: Registrar calificaciones de bachillerato

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-82: Registrar calificaciones de bachillerato |
| **Actor** | Administrador, Gestor Administrativo y Docente |
| **Objetivo** | Capturar el rendimiento escolar numérico de un alumno de bachillerato de manera bimestral, respetando la estructura de evaluaciones de este nivel. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Registro de Calificaciones.<br>2. Busca y selecciona a un alumno de Bachillerato.<br>3. El sistema carga la retícula de materias correspondientes al grado del alumno con la plantilla Bimestral.<br>4. El actor selecciona el bimestre a evaluar (ej. Bimestre 1).<br>5. El actor ingresa las calificaciones numéricas para cada materia.<br>6. Hace clic en "Guardar Evaluación".<br>7. El sistema valida las notas y las guarda, actualizando el perfil académico del alumno en curso. |
| **Flujo Alterno** | <b>A.</b> Calificación fuera de rango:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 6, el sistema detecta notas fuera del rango permitido (ej. mayores a 10).<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema resalta el campo erróneo y solicita la corrección.<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El actor modifica el valor y reintenta. |
| **Precondiciones** | El alumno debe estar activo en un grupo de bachillerato y el actor debe tener permisos para modificar boletas. |
| **Postcondiciones** | Las calificaciones del bimestre quedan registradas en el historial del alumno. |
| **Reglas de negocio involucradas** | La evaluación es estrictamente bimestral para este nivel, requiriendo validaciones de rango numérico. |
