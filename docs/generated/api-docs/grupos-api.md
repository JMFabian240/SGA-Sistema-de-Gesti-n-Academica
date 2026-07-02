# Documentación de API - Módulo `grupos`

Este módulo gestiona la estructura académica principal de la institución, la cual abarca los Niveles Educativos, los Ciclos Escolares, las Materias y los Grupos, así como la asignación de materias (y docentes opcionales) a cada grupo.

> **Nota General**: Todos los procedimientos en este módulo están restringidos (`protectedProcedure`) y requieren un token de autenticación. Las eliminaciones (`delete*`) ejecutan un Soft Delete marcando la fecha actual en la columna `eliminadoEn`.

## Procedimientos

### Niveles Educativos (`nivel_educativo`)
- `grupos.getNiveles` (Query): Retorna todos los niveles educativos activos, ordenados de forma ascendente por su columna `orden`.
- `grupos.createNivel` (Mutation): Crea un nivel educativo (ej. Preescolar, Primaria).
- `grupos.updateNivel` (Mutation): Actualiza nombre, código, RVOE o el orden de un nivel.
- `grupos.deleteNivel` (Mutation): Marca el nivel como eliminado logicamente. Recibe `nivelId` (number).

### Ciclos Escolares (`ciclo_escolar`)
- `grupos.getCiclos` (Query): Obtiene todos los ciclos escolares ordenados por fecha de inicio descendente.
- `grupos.createCiclo` (Mutation): Crea un nuevo ciclo. Retorna error si las fechas son inválidas.
- `grupos.updateCiclo` (Mutation): Actualiza información del ciclo. Si se envía `activo: true`, el servidor ejecuta una transacción que automáticamente marca todos los demás ciclos como `activo: false`.
- `grupos.deleteCiclo` (Mutation): Soft delete de un ciclo. Recibe `cicloId`.

### Materias (`materia`)
- `grupos.getMaterias` (Query): Obtiene el catálogo de materias.
- `grupos.createMateria` (Mutation): Registra una nueva materia.
- `grupos.updateMateria` (Mutation): Actualiza la información (nombre, clave).
- `grupos.deleteMateria` (Mutation): Soft delete de la materia. Recibe `materiaId`.

### Grupos (`grupo`)
- `grupos.getGrupos` (Query): Obtiene los grupos activos. Opcionalmente acepta un filtro por `cicloId`. Incluye las relaciones de `NivelEducativo`, `CicloEscolar` y las materias asignadas a través de `GrupoMateria`.
- `grupos.createGrupo` (Mutation): Registra un nuevo grupo (requiere `nivelId` y `cicloId`).
- `grupos.updateGrupo` (Mutation): Modifica el nombre o cupo de un grupo existente.
- `grupos.deleteGrupo` (Mutation): Soft delete del grupo.

### Asignaciones (`grupo_materia`)
- `grupos.assignMateria` (Mutation): Asigna una materia a un grupo. Opcionalmente puede recibir el `docenteId` (ID del usuario) si se conoce.
- `grupos.unassignMateria` (Mutation): Elimina la asignación (Hard Delete, ya que es una tabla pivote). Recibe `grupoMateriaId`.

## Manejo de Errores
- `BAD_REQUEST`: Si Zod rechaza el payload (ej. cadena muy larga, o ID negativo).
- `UNAUTHORIZED`: Fallo de validación del token de sesión.
