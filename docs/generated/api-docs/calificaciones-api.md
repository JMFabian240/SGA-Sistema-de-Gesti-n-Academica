# Documentación de API - Módulo `calificaciones`

Este módulo se encarga del registro, actualización y consulta de las evaluaciones de los estudiantes, tanto numéricas como cualitativas (RF-33, RF-34). 

> **Nota General**: Todos los procedimientos en este módulo están restringidos (`protectedProcedure`) y extraen automáticamente el ID del usuario (`usuarioId`) del contexto para registrar la autoría (quién subió o modificó la calificación).

## Procedimientos

### Calificaciones (`calificacion`)

- `calificaciones.getPorGrupo` (Query): Consulta diseñada para la vista de captura del docente. Permite obtener todas las calificaciones de un grupo en una materia específica (`grupoMateriaId`), opcionalmente filtradas por periodo. Los alumnos inactivos son ignorados.
- `calificaciones.getPorAlumno` (Query): Consulta diseñada para tutores o control escolar. Trae el kárdex completo del alumno, ordenado por ciclo escolar, periodo y nombre de la materia.
- `calificaciones.upsert` (Mutation): Inserta o actualiza una calificación.
  - **Inputs**: `alumnoId`, `grupoMateriaId`, `periodoId`, `tipoEvaluacion` (enum: PARCIAL, BIMESTRE, BLOQUE, TRIMESTRE), `valorNumerico` (opcional), `valorCualitativo` (opcional), `textoObservacion`, `textoRecomendacion`, `cuentaParaPromedio`.
  - **Validación Especial (Zod)**: Se exige que por lo menos se envíe un `valorNumerico` (max 10) o un `valorCualitativo`.
  - **Comportamiento Lógico**: El sistema busca si ya existe un registro de calificación para ese mismo alumno en ese mismo periodo, materia y tipo de evaluación. Si existe, hace un `update`; si no, hace un `create`.
- `calificaciones.delete` (Mutation): Elimina de manera permanente (Hard Delete) una calificación que fue capturada accidentalmente, ya que la tabla `Calificacion` no maneja Soft Delete por diseño.

## Manejo de Errores
- `BAD_REQUEST`: Valores que no cumplen con los esquemas de Zod (ej. enviar `valorNumerico` y `valorCualitativo` en null, o exceder la escala).
- `NOT_FOUND`: Si el alumno no existe o fue dado de baja, o si la materia no está ligada a un grupo.
