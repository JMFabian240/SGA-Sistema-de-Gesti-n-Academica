# RF-69: Consultar historial de pagos

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** |  RF-69: Consultar historial de pagos |
| **Actor** |  Administrador y Gestor Administrativo |
| **Objetivo** |  Permitir la búsqueda y visualización cronológica de todos los movimientos financieros de un padre de familia a través de una línea de tiempo interactiva. |
| **Flujo Principal** | 1. El actor ingresa al módulo de directorio escolar.<br>2. Utiliza la barra de búsqueda e ingresa el nombre del alumno o el nombre del tutor.<br>3. El sistema despliega las coincidencias encontradas.<br>4. El actor selecciona el perfil del padre de familia o alumno deseado.<br>5. El sistema carga y muestra en pantalla una línea de tiempo detallada con todos los pagos realizados, montos, fechas, estados (pagado, pendiente, vencido) y saldos restantes. |
| **Flujo Alterno** | <b>A.</b> Búsqueda sin resultados:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 3, el sistema no encuentra coincidencias.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra el mensaje: "No se encontró historial para el parámetro ingresado".<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El actor modifica la búsqueda e intenta nuevamente. |
| **Precondiciones** |  El actor debe tener sesión iniciada. Debe existir un historial de pagos o estructura de cobros generada para el alumno/tutor consultado. |
| **Postcondiciones** | El actor visualiza el estatus financiero de la familia. Al ser consulta, no se altera ningún registro en la base de datos. |
| **Reglas de negocio involucradas** | • La consulta puede realizarse indistintamente por el nombre del alumno o el nombre del tutor.<br>• La línea de tiempo debe reflejar en tiempo real el estatus exacto de cada concepto (pagado, pendiente, vencido). |
