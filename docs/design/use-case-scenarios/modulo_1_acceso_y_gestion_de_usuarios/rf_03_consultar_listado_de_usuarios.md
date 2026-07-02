# RF-03: Consultar listado de usuarios

| Campo | Descripción |
| :---- | :---- |
| **Nombre** | RF-03: Consultar listado de usuarios |
| **Actor** | Administrador |
| **Objetivo** | Acceder a un directorio global de todos los colaboradores registrados para auditar quiénes tienen acceso, su nivel de permisos y cuándo fue su última actividad. |
| **Flujo Principal** | 1. El Administrador hace clic para ingresar al módulo de Gestión de Usuarios.<br>2. El sistema consulta la base de datos automáticamente, sin requerir parámetros de búsqueda iniciales.<br>3. El sistema despliega en pantalla la tabla con todos los usuarios registrados.<br>4. El Administrador visualiza: nombre completo, rol asignado, estado de la cuenta (activa/desactivada) y fecha/hora de su último acceso. |
| **Flujo Alterno** | <b>A.</b> Error de carga o pérdida de conexión:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 2, el sistema no logra recuperar información de la base de datos.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra: "No se pudo cargar el listado. Verifique su conexión e intente nuevamente".<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El Administrador recarga la página o reingresa al módulo. |
| **Precondiciones** | • El Administrador debe tener sesión activa con los privilegios correspondientes. • Deben existir registros de usuarios en la base de datos. |
| **Postcondiciones** | El Administrador visualiza la lista detallada y actualizada del personal. Al ser de solo lectura, la base de datos no sufre ninguna alteración. |
| **Reglas de negocio involucradas** | • La visualización del listado completo es un permiso estrictamente reservado al Administrador.<br>• La fecha de último acceso se actualiza automáticamente en cada inicio de sesión exitoso. |
