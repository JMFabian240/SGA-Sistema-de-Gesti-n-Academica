# RF-16: Consultar historial de bitácora

| Campo | Descripción |
| :---- | :---- |
| **Nombre** | RF-16: Consultar historial de bitácora |
| **Actor** | Administrador |
| **Objetivo** | Permitir al Administrador auditar visualmente el historial de movimientos registrados en la plataforma. |
| **Flujo Principal** | 1. El Administrador ingresa al módulo de "Seguridad y Bitácora".<br>2. El Sistema consulta la base de datos ordenando los registros cronológicamente (más recientes primero).<br>3. El Sistema despliega la tabla con el historial: usuario/sistema, fecha-hora, módulo/registro afectado y tipo de cambio. |
| **Flujo Alterno** | <b>A.</b> Base de datos sin actividad:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 2, el Sistema detecta que la tabla de bitácora está vacía.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El Sistema muestra: "Aún no hay registros de actividad en la plataforma". |
| **Precondiciones** | El Administrador debe tener sesión activa con los permisos de seguridad correspondientes. |
| **Postcondiciones** | El Administrador visualiza el historial completo ordenado cronológicamente. Es una operación de solo lectura; no se modifica la base de datos. |
| **Reglas de negocio involucradas** | • La capacidad de ver este historial es exclusiva del Administrador.<br>• Los registros son de solo lectura; no pueden editarse ni eliminarse desde esta pantalla. |
