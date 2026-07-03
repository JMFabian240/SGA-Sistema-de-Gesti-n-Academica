```markdown
| Campo | Descripción Técnica |
| :--- | :--- |
| **1. Autor(es)** | Sistema Generador SGA |
| **2. Nombre del caso de uso** | CU-M14-01: Asignación de Roles y Permisos |
| **3. Actor principal** | Administrador de Sistema (Admin) |
| **4. Objetivo** | Gestionar y asignar los roles del sistema (ej. Admin, Docente, Cajero) a un usuario particular para controlar su acceso a módulos. |
| **5. Precondiciones** | - El catálogo de Roles está precargado en la BD.<br>- El Administrador tiene permisos suficientes (autorización) para cambiar roles. |
| **6. Postcondiciones** | La tabla relacional `UsuarioRol` se actualiza transaccionalmente (se borran los viejos, se insertan los nuevos). |
| **7. Flujo principal (Happy Path)** | **1. Actor:** Se encuentra en el listado de Usuarios (`UsuariosListPage`).<br>**2. Actor:** Hace clic en el botón "Gestionar Roles" (icono Escudo) en la fila de un usuario específico.<br>**3. Sistema:** Abre un Modal sobrepuesto (`RolesModal`) e invoca tRPC query `getRoles`.<br>**4. Sistema:** Muestra el catálogo de roles del sistema en forma de lista de Checkboxes, pre-seleccionando los roles que el usuario ya poseía (tomados del estado de la fila).<br>**5. Actor:** Marca o desmarca roles según su criterio.<br>**6. Actor:** Hace clic en el botón "Guardar Roles".<br>**7. Sistema:** Ejecuta tRPC mutation `asignarRoles`, enviando `usuarioId` y `roles[]`.<br>**8. Sistema (Backend):** Inicia `$transaction` en Prisma.<br>**9. Sistema (Backend):** Ejecuta `deleteMany` en `usuarioRol` para el usuario.<br>**10. Sistema (Backend):** Ejecuta `createMany` en `usuarioRol` con los nuevos roles.<br>**11. Sistema:** Cierra el Modal y recarga el listado de usuarios (`refetch`). |
| **8. Flujos alternos** | - **A1. Cancelación:** Si el actor presiona "Cancelar" o la "X", el modal se cierra y el estado local de checkboxes se descarta. |
| **9. Flujos de excepción** | - **E1. Validación Vacía:** Si el usuario desmarca absolutamente todos los checkboxes e intenta guardar, el sistema bloquea con un alert: "Debe tener al menos un rol asignado". |
| **10. Reglas de negocio** | - R1: El backend debe garantizar atomicidad usando transacciones de base de datos para no dejar a un usuario sin roles a medias si falla el servidor. |
```
