# Esquema Inicial Generado

**Fecha de generación:** 2026-07-01

## Lista de Modelos Generados

- `Rol` -> `rol`
- `Usuario` -> `usuario`
- `UsuarioRol` -> `usuario_rol`
- `UsuarioPermisoModulo` -> `usuario_permiso_modulo`
- `IntentoLogin` -> `intento_login`
- `TokenRevocado` -> `token_revocado`
- `ConfiguracionGlobal` -> `configuracion_global`
- `LogAuditoria` -> `log_auditoria`
- `NivelEducativo` -> `nivel_educativo`
- `CicloEscolar` -> `ciclo_escolar`
- `Grupo` -> `grupo`
- `Materia` -> `materia`
- `GrupoMateria` -> `grupo_materia`
- `Tutor` -> `tutor`
- `DatosFiscales` -> `datos_fiscales`
- `Alumno` -> `alumno`
- `TutorAlumno` -> `tutor_alumno`
- `Tarifa` -> `tarifa`
- `PlanPago` -> `plan_pago`
- `InscripcionCiclo` -> `inscripcion_ciclo`
- `CalendarioPago` -> `calendario_pago`
- `Pago` -> `pago`
- `AplicacionPago` -> `aplicacion_pago`
- `Recargo` -> `recargo`
- `MovimientoSaldo` -> `movimiento_saldo`
- `Beca` -> `beca`
- `SolicitudBeca` -> `solicitud_beca`
- `AsignacionBeca` -> `asignacion_beca`
- `VentanaInscripcionTemprana` -> `ventana_inscripcion_temprana`
- `Calificacion` -> `calificacion`
- `Asistencia` -> `asistencia`
- `Documento` -> `documento`
- `Notificacion` -> `notificacion`

## Lista de Enums Generados

- `EstadoAlumno` (ACTIVO, BAJA_DEFINITIVA, BAJA_TEMPORAL, EGRESADO, TRANSICION_PENDIENTE)
- `MetodoPago` (DEPOSITO, TRANSFERENCIA, TARJETA_DEBITO, TARJETA_CREDITO)
- `EstadoCobro` (PENDIENTE, PAGADO, VENCIDO, CANCELADO)
- `CriterioBeca` (ACADEMICA, SOCIOECONOMICA, DEPORTIVA, CULTURAL, POR_HERMANOS, PROMOCION_TEMPRANA, EXTERNA)
- `EstadoBeca` (ACTIVA, SUSPENDIDA, CANCELADA, VENCIDA)
- `TipoEvaluacion` (PARCIAL, BIMESTRE, BLOQUE, TRIMESTRE)
- `TipoNotificacion` (ADEUDO, BECA, PAGO_VENCIDO, CIERRE_CICLO, DOCUMENTACION)
- `NivelPermiso` (LECTURA, LECTURA_Y_ESCRITURA, DENEGADO)

## Decisiones Tomadas

- **Mapeo de nombres:** Se utilizó `@map` en las columnas y `@@map` en las tablas para preservar exactamente los nombres en formato *snake_case* definidos en SQL, usando *camelCase* y *PascalCase* en Prisma respectivamente para seguir el estándar de Prisma.
- **Enums a partir de CHECKs:** Todas las restricciones `CHECK (... IN (...))` en SQL se han modelado como enums formales en Prisma. En particular, en `metodo_pago` se dividió `'DEPOSITO,TRANSFERENCIA'` en dos valores distintos de enum (`DEPOSITO`, `TRANSFERENCIA`) además de las tarjetas, según lo que indicaban las reglas de negocio. En `nivel_permiso`, el valor de SQL `'LECTURA Y ESCRITURA'` se cambió al nombre de enum válido `LECTURA_Y_ESCRITURA`.
- **Soft Deletes:** Todas las columnas `eliminado_en` se marcaron como opcionales `DateTime?` tal como solicita el requerimiento.
- **Relaciones Opcionales:** Se infirieron correctamente las cardinalidades. Campos de clave foránea sin `NOT NULL` (ej. `asignado_por` en `UsuarioRol`) se dejaron como opcionales (`Int?`) en Prisma.
- **Nombres de relaciones:** Se añadieron nombres a las relaciones bidireccionales múltiples en una misma tabla (por ejemplo, en las becas con el usuario "solicitador" vs "resolvedor") para que Prisma sepa resolver las asociaciones sin ambigüedad.

## Comando para correr la primera migración

Una vez que se haya configurado el string de conexión en `.env` (variable `DATABASE_URL`), se puede ejecutar la migración inicial para que Prisma alinee la base de datos (o cree las tablas desde cero si está vacía):

```bash
npx prisma migrate dev --name init
```
O si las tablas ya existen en PostgreSQL y solo queremos que Prisma tome control o haga una línea base (baseline) saltándose la creación inicial, se usaría `prisma migrate resolve --applied ...`. Para propósitos de este entorno, ejecutar:

```bash
npx prisma db push
```
