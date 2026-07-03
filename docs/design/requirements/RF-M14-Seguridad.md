```markdown
# Especificación de Requerimientos Funcionales - SGA (Seguridad y Catálogos)

## Módulo 14: Seguridad (Roles y Permisos)
| ID | Descripción | Tipo |
| :--- | :--- | :--- |
| RF-14.01 | El sistema debe poder proveer el catálogo de roles disponibles, consultando la tabla Rol, para mostrar las opciones al administrador en la interfaz. | Sistema |
| RF-14.02 | El administrador debe poder visualizar los roles de un usuario específico, haciendo clic en el botón de "Gestionar Roles" en el listado de usuarios, para desplegar el modal con los roles actuales pre-seleccionados. | Usuario |
| RF-14.03 | El administrador debe poder asignar o revocar roles a un usuario, marcando o desmarcando los checkboxes en el modal de Gestión de Roles, para configurar el nivel de acceso del personal. | Usuario |
| RF-14.04 | El sistema debe poder aplicar transaccionalmente los nuevos roles asignados, procesando la solicitud (borrado e inserción en UsuarioRol), para garantizar la integridad de los accesos. | Sistema |
```
