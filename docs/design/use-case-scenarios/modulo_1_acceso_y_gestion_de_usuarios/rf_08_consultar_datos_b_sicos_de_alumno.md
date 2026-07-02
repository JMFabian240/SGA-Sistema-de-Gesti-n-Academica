# RF-08: Consultar datos básicos de alumno

| Campo | Descripción |
| :---- | :---- |
| **Nombre** | RF-08: Consultar datos básicos de alumno |
| **Actor** | Docente |
| **Objetivo** | Permitir al personal docente buscar y visualizar la información general y de seguridad de un alumno, garantizando la privacidad de datos financieros y fiscales de la familia. |
| **Flujo Principal** | 1. El Docente inicia sesión y navega a la sección de consulta de alumnos.<br>2. Ingresa un criterio en la barra de búsqueda (Estatus, nombre, grado o grupo, nivel escolar).<br>3. Ejecuta la búsqueda.<br>4. El sistema despliega la lista de resultados coincidentes.<br>5. El Docente selecciona el perfil del alumno deseado.<br>6. El sistema muestra: nombre del alumno, grado, grupo y personas autorizadas para recogerlo. |
| **Flujo Alterno** | <b>A.</b> Búsqueda sin resultados:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 4, no se encuentran coincidencias.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra: "No se encontraron alumnos con los criterios proporcionados".<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El Docente ajusta los parámetros y reintenta. |
| **Precondiciones** | • El Docente debe tener sesión activa. • Los expedientes deben estar registrados en la base de datos. |
| **Postcondiciones** | El Docente visualiza la información requerida. No se realiza ninguna modificación en la base de datos (solo lectura). |
| **Reglas de negocio involucradas** | • El perfil Docente tiene bloqueado el acceso a módulos financieros y de facturación.<br>• El sistema filtra y oculta datos de pagos, adeudos, becas, RFC o datos fiscales del tutor. |
