# RF-77: Consultar alumnos con derecho a examen restringido

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-77: Consultar alumnos con derecho a examen restringido |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Generar un listado de estudiantes que tienen bloqueado el derecho a evaluaciones debido a adeudos de colegiatura o conceptos vencidos mayores a 60 días. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Reportes o Evaluación.<br>2. Hace clic en "Alumnos con examen restringido".<br>3. El sistema solicita el periodo de evaluación próximo a realizarse.<br>4. El actor indica el periodo (ej. Trimestre 1).<br>5. El sistema cruza el historial de adeudos vigentes con el calendario de exámenes.<br>6. El sistema genera y muestra la lista de los alumnos que no cumplen los requisitos financieros para presentar examen.<br>7. El actor exporta la lista en Excel o PDF para entregar a los docentes. |
| **Flujo Alterno** | <b>A.</b> Todos los alumnos habilitados:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 5, el sistema no detecta morosidad bloqueante.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El listado se genera vacío indicando: "No hay alumnos restringidos para este periodo". |
| **Precondiciones** | Deben existir adeudos registrados en estado "vencido" y un calendario de evaluaciones próximo. |
| **Postcondiciones** | La administración obtiene una lista física o digital para bloquear la entrega de exámenes a los alumnos correspondientes. |
| **Reglas de negocio involucradas** | • El sistema debe relacionar automáticamente el estado financiero con el permiso de presentación académica. |
