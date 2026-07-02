# Documentación de API - Módulo `alumnos`

Este módulo maneja el registro y administración de los alumnos inscritos en la institución educativa, así como la vinculación relacional con sus tutores. Cubre las funcionalidades correspondientes a RF-20, RF-23 y RF-25.

> **Nota General**: Todos los procedimientos en este módulo están restringidos (`protectedProcedure`) y requieren un token de autenticación. Las bajas (`delete`) ejecutan un Soft Delete marcando la fecha actual en la columna `eliminadoEn` y cambiando el estado a `BAJA_DEFINITIVA`.

## Procedimientos

### Alumnos (`alumno`)

- `alumnos.getAll` (Query): Obtiene una lista de todos los alumnos activos, ordenados por nombre completo. Incluye la información del nivel educativo al que pertenecen y un anidado de los tutores vinculados.
- `alumnos.getById` (Query): Obtiene todo el expediente del alumno a través del `alumnoId`. Incluye nivel educativo, historial de inscripciones, y el listado de tutores con sus respectivos datos fiscales si cuentan con ellos.
- `alumnos.create` (Mutation): Inscribe un nuevo alumno en la base de datos.
  - **Inputs**: `matricula` (opcional), `curp` (18 caracteres exactos), `nombreCompleto`, `fechaNacimiento`, `sexo` (1 caracter), `nivelId`, `estado` (enum: `ACTIVO`, `BAJA_DEFINITIVA`, `BAJA_TEMPORAL`, `EGRESADO`, `TRANSICION_PENDIENTE`), `diaLimitePago`, etc.
  - **Validación Especial**: El servidor rechazará (`BAD_REQUEST`) la solicitud si el CURP o la matrícula ya existen en otro alumno.
- `alumnos.update` (Mutation): Modifica el expediente del alumno. Además de los campos estándar, permite documentar una `fechaBaja` y un `motivoBaja` temporal o definitivo.
- `alumnos.delete` (Mutation): Desactiva a un alumno, pasándolo a estado `BAJA_DEFINITIVA` y aplicando el Soft Delete.

### Relación Alumno - Tutor (`tutor_alumno`)

- `alumnos.linkTutor` (Mutation): Vincula a un tutor ya existente con un alumno.
  - **Inputs**: `alumnoId`, `tutorId`, `parentesco` y un boolean `esPrincipal`.
  - **Comportamiento**: Si se define `esPrincipal: true`, el sistema revoca internamente esa bandera a cualquier otro tutor asociado al mismo alumno, garantizando la consistencia de que solo exista un tutor principal. Si la relación ya existía (ej. se había borrado o se modificó el parentesco), se realiza un *upsert* actualizando el registro.
- `alumnos.unlinkTutor` (Mutation): Desvincula a un tutor de un alumno (Hard delete en la tabla pivote).
  - **Inputs**: `tutorAlumnoId`.

## Manejo de Errores
- `BAD_REQUEST`: Duplicidad de identificadores únicos (CURP/Matrícula) o inputs inválidos por Zod.
- `NOT_FOUND`: El alumno solicitado no existe.
- `UNAUTHORIZED`: Fallo de sesión.
