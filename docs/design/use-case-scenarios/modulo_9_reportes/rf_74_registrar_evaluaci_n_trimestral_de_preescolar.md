# RF-74: Registrar evaluación trimestral de preescolar

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-74: Registrar evaluación trimestral de preescolar |
| **Actor** | Administrador, Gestor Administrativo y Docente |
| **Objetivo** | Capturar el rendimiento escolar de un alumno de preescolar de manera cualitativa (observaciones y recomendaciones en texto), respetando el formato de evaluación no numérica del nivel. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Registro de Calificaciones.<br>2. Selecciona a un alumno perteneciente al nivel "Preescolar".<br>3. El sistema carga una plantilla de evaluación de formato cualitativo adaptada para este nivel.<br>4. El actor selecciona el trimestre correspondiente (Trimestre 1, 2 o 3).<br>5. El actor redacta en texto las observaciones y recomendaciones del alumno.<br>6. Hace clic en "Guardar Evaluación".<br>7. El sistema almacena la captura vinculándola al expediente y ciclo escolar activo, sin pedir promedios numéricos. |
| **Flujo Alterno** | <b>A.</b> Campos en blanco:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 6, el sistema detecta que no se ingresó texto en las observaciones y recomendaciones.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra un aviso: "Las observaciones y recomendaciones no pueden estar vacías para poder guardar".<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El actor ingresa el texto correspondiente y reintenta. |
| **Precondiciones** | El alumno debe estar inscrito formalmente en el nivel preescolar. El actor debe tener permisos para modificar boletas/calificaciones. |
| **Postcondiciones** | La evaluación queda guardada y lista para ser impresa en formato de texto en las juntas trimestrales (boleta cualitativa). |
| **Reglas de negocio involucradas** | • El sistema debe inhibir o bloquear explícitamente los campos numéricos cuando el nivel educativo validado del alumno sea "Preescolar". |
