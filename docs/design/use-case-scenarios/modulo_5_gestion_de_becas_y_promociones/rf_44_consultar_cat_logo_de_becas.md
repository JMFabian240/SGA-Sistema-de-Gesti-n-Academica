# RF-44: Consultar catálogo de becas

| Campo | Descripción |
| :---: | ----- |
| **Autor** | José Manuel Fabian Hernández |
| **Nombre** | RF-44: Consultar catálogo de becas |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Acceder al catálogo de tipos de beca registrados en el sistema para visualizar las becas disponibles, sus criterios de asignación y los porcentajes de descuento configurados. |
| **Flujo Principal** | 1. El actor (Administrador o Gestor) ingresa al módulo de Gestión de Becas.<br>2. Selecciona la opción "Consultar catálogo de becas".<br>3. El sistema consulta la base de datos y despliega en pantalla el listado completo de tipos de beca registrados.<br>4. El actor visualiza para cada beca: nombre, criterio de asignación y porcentaje de descuento.<br>5. Opcionalmente, el actor selecciona un tipo de beca específico para ver su detalle completo.<br>6. El sistema muestra la información detallada de la beca seleccionada. |
| **Flujo Alterno** | <b>A.</b> Catálogo vacío:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 3, el sistema no encuentra tipos de beca registrados en la base de datos.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra el mensaje: "No existen tipos de beca registrados en el catálogo. Registre un tipo de beca para comenzar (RF-25)".<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El actor puede registrar una nueva beca (RF-25) o regresar al panel principal. |
| **Precondiciones** | El actor debe tener sesión activa con los privilegios de Administrador o Gestor Administrativo. |
| **Postcondiciones** | El actor visualiza el catálogo completo de becas disponibles. Al ser una operación de consulta, no se realiza ninguna modificación en la base de datos. |
| **Reglas de negocio involucradas** | • La consulta del catálogo de becas está habilitada para los perfiles Administrador y Gestor Administrativo.<br>• La lista debe mostrar únicamente los tipos de beca activos vigentes en el catálogo del sistema. |
