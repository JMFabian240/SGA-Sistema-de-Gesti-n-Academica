-- CreateEnum
CREATE TYPE "EstadoAlumno" AS ENUM ('ACTIVO', 'BAJA_DEFINITIVA', 'BAJA_TEMPORAL', 'EGRESADO', 'TRANSICION_PENDIENTE');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('DEPOSITO', 'TRANSFERENCIA', 'TARJETA_DEBITO', 'TARJETA_CREDITO');

-- CreateEnum
CREATE TYPE "EstadoCobro" AS ENUM ('PENDIENTE', 'PAGADO', 'VENCIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "CriterioBeca" AS ENUM ('ACADEMICA', 'SOCIOECONOMICA', 'DEPORTIVA', 'CULTURAL', 'POR_HERMANOS', 'PROMOCION_TEMPRANA', 'EXTERNA');

-- CreateEnum
CREATE TYPE "EstadoBeca" AS ENUM ('ACTIVA', 'SUSPENDIDA', 'CANCELADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "TipoEvaluacion" AS ENUM ('PARCIAL', 'BIMESTRE', 'BLOQUE', 'TRIMESTRE');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('ADEUDO', 'BECA', 'PAGO_VENCIDO', 'CIERRE_CICLO', 'DOCUMENTACION');

-- CreateEnum
CREATE TYPE "NivelPermiso" AS ENUM ('LECTURA', 'LECTURA_Y_ESCRITURA', 'DENEGADO');

-- CreateTable
CREATE TABLE "rol" (
    "rol_id" SERIAL NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" SERIAL NOT NULL,
    "nombre_usuario" VARCHAR(80) NOT NULL,
    "nombre_completo" VARCHAR(120) NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(15),
    "password_hash" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN DEFAULT true,
    "intentos_fallidos" INTEGER DEFAULT 0,
    "bloqueado_hasta" TIMESTAMPTZ,
    "ultimo_acceso" TIMESTAMPTZ,
    "debe_cambiar_pwd" BOOLEAN DEFAULT false,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "usuario_rol" (
    "usuario_rol_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "asignado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "asignado_por" INTEGER,
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuario_rol_id")
);

-- CreateTable
CREATE TABLE "usuario_permiso_modulo" (
    "permiso_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "modulo" VARCHAR(30) NOT NULL,
    "nivel" "NivelPermiso" NOT NULL,
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_permiso_modulo_pkey" PRIMARY KEY ("permiso_id")
);

-- CreateTable
CREATE TABLE "intento_login" (
    "intento_id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "nombre_usuario_intentado" VARCHAR(80) NOT NULL,
    "exitoso" BOOLEAN NOT NULL,
    "direccion_ip" VARCHAR(45),
    "user_agent" TEXT,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intento_login_pkey" PRIMARY KEY ("intento_id")
);

-- CreateTable
CREATE TABLE "token_revocado" (
    "id" BIGSERIAL NOT NULL,
    "jti" VARCHAR(36) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "revocado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "expira_en" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "token_revocado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_global" (
    "configuracion_id" INTEGER NOT NULL,
    "monto_recargo_defecto" DECIMAL(12,2) NOT NULL,
    "dias_gracia_recargo" INTEGER NOT NULL,
    "plazo_inscripcion_dias" INTEGER NOT NULL,
    "umbrales_smtp_dias" JSONB NOT NULL,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_global_pkey" PRIMARY KEY ("configuracion_id")
);

-- CreateTable
CREATE TABLE "log_auditoria" (
    "log_id" BIGSERIAL NOT NULL,
    "usuario_id" INTEGER,
    "accion" VARCHAR(10) NOT NULL,
    "tabla_afectada" VARCHAR(60) NOT NULL,
    "registro_id" VARCHAR(50) NOT NULL,
    "valores_antes" JSONB,
    "valores_despues" JSONB,
    "fecha_hora" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "direccion_ip" VARCHAR(45),
    "descripcion" TEXT,

    CONSTRAINT "log_auditoria_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "nivel_educativo" (
    "nivel_id" SERIAL NOT NULL,
    "codigo" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "rvoe" VARCHAR(40),
    "orden" INTEGER NOT NULL,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "nivel_educativo_pkey" PRIMARY KEY ("nivel_id")
);

-- CreateTable
CREATE TABLE "ciclo_escolar" (
    "ciclo_id" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "activo" BOOLEAN DEFAULT false,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "ciclo_escolar_pkey" PRIMARY KEY ("ciclo_id")
);

-- CreateTable
CREATE TABLE "grupo" (
    "grupo_id" SERIAL NOT NULL,
    "nivel_id" INTEGER NOT NULL,
    "ciclo_id" INTEGER NOT NULL,
    "nombre" VARCHAR(10) NOT NULL,
    "cupo_maximo" INTEGER NOT NULL,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("grupo_id")
);

-- CreateTable
CREATE TABLE "materia" (
    "materia_id" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "clave" VARCHAR(20) NOT NULL,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "materia_pkey" PRIMARY KEY ("materia_id")
);

-- CreateTable
CREATE TABLE "grupo_materia" (
    "grupo_materia_id" SERIAL NOT NULL,
    "grupo_id" INTEGER NOT NULL,
    "materia_id" INTEGER NOT NULL,
    "docente_id" INTEGER,

    CONSTRAINT "grupo_materia_pkey" PRIMARY KEY ("grupo_materia_id")
);

-- CreateTable
CREATE TABLE "tutor" (
    "tutor_id" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(120) NOT NULL,
    "correo_electronico" VARCHAR(255),
    "telefono" VARCHAR(15),
    "direccion" TEXT,
    "curp" VARCHAR(18),
    "requiere_factura" BOOLEAN DEFAULT false,
    "tipo_pago_habitual" VARCHAR(15),
    "saldo_a_favor" DECIMAL(12,2) DEFAULT 0,
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "tutor_pkey" PRIMARY KEY ("tutor_id")
);

-- CreateTable
CREATE TABLE "datos_fiscales" (
    "fiscal_id" SERIAL NOT NULL,
    "tutor_id" INTEGER NOT NULL,
    "rfc" VARCHAR(13) NOT NULL,
    "razon_social" VARCHAR(120) NOT NULL,
    "regimen_fiscal" VARCHAR(10),
    "uso_cfdi" VARCHAR(10),
    "direccion_fiscal" TEXT,
    "codigo_postal" VARCHAR(10),
    "correo_facturacion" VARCHAR(255),
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "datos_fiscales_pkey" PRIMARY KEY ("fiscal_id")
);

-- CreateTable
CREATE TABLE "alumno" (
    "alumno_id" SERIAL NOT NULL,
    "matricula" VARCHAR(30),
    "curp" VARCHAR(18) NOT NULL,
    "nombre_completo" VARCHAR(120) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "sexo" CHAR(1) NOT NULL,
    "nivel_id" INTEGER NOT NULL,
    "estado" "EstadoAlumno" NOT NULL,
    "fecha_baja" DATE,
    "motivo_baja" TEXT,
    "dia_limite_pago" INTEGER DEFAULT 10,
    "personas_autorizadas" JSONB,
    "tipo_sangre" VARCHAR(10),
    "alergias" TEXT,
    "padecimientos" TEXT,
    "observaciones" TEXT,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "alumno_pkey" PRIMARY KEY ("alumno_id")
);

-- CreateTable
CREATE TABLE "tutor_alumno" (
    "tutor_alumno_id" SERIAL NOT NULL,
    "tutor_id" INTEGER NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "es_principal" BOOLEAN DEFAULT false,
    "parentesco" VARCHAR(20) NOT NULL,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_alumno_pkey" PRIMARY KEY ("tutor_alumno_id")
);

-- CreateTable
CREATE TABLE "tarifa" (
    "tarifa_id" SERIAL NOT NULL,
    "ciclo_id" INTEGER NOT NULL,
    "nivel_id" INTEGER NOT NULL,
    "concepto" VARCHAR(15) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "descripcion" TEXT,
    "activa" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "tarifa_pkey" PRIMARY KEY ("tarifa_id")
);

-- CreateTable
CREATE TABLE "plan_pago" (
    "plan_pago_id" SERIAL NOT NULL,
    "nombre" VARCHAR(40) NOT NULL,
    "meses" INTEGER NOT NULL,
    "monto_mensual" DECIMAL(12,2) NOT NULL,
    "monto_diciembre" DECIMAL(12,2),
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "plan_pago_pkey" PRIMARY KEY ("plan_pago_id")
);

-- CreateTable
CREATE TABLE "inscripcion_ciclo" (
    "inscripcion_id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "ciclo_id" INTEGER NOT NULL,
    "grupo_id" INTEGER,
    "plan_pago_id" INTEGER NOT NULL,
    "fecha_ingreso" DATE NOT NULL,
    "es_ingreso_tardio" BOOLEAN DEFAULT false,
    "estado_en_ciclo" VARCHAR(20) NOT NULL,
    "estado_financiero" VARCHAR(20) NOT NULL,
    "meses_adeudo" INTEGER DEFAULT 0,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "inscripcion_ciclo_pkey" PRIMARY KEY ("inscripcion_id")
);

-- CreateTable
CREATE TABLE "calendario_pago" (
    "calendario_pago_id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "ciclo_id" INTEGER NOT NULL,
    "concepto" VARCHAR(25) NOT NULL,
    "mes" VARCHAR(15),
    "fecha_vencimiento" DATE NOT NULL,
    "monto_original" DECIMAL(12,2) NOT NULL,
    "monto_pagado" DECIMAL(12,2) DEFAULT 0,
    "monto_recargo" DECIMAL(12,2) DEFAULT 0,
    "saldo_pendiente" DECIMAL(12,2) NOT NULL,
    "estado_cobro" "EstadoCobro" NOT NULL,
    "liquidado_at" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "calendario_pago_pkey" PRIMARY KEY ("calendario_pago_id")
);

-- CreateTable
CREATE TABLE "pago" (
    "pago_id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "tutor_id" INTEGER NOT NULL,
    "fecha_pago" DATE NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "metodo_pago" "MetodoPago" NOT NULL,
    "aplicado_a_saldo" BOOLEAN DEFAULT false,
    "observaciones" TEXT,
    "registrado_por" INTEGER NOT NULL,
    "registrado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("pago_id")
);

-- CreateTable
CREATE TABLE "aplicacion_pago" (
    "aplicacion_id" SERIAL NOT NULL,
    "pago_id" INTEGER NOT NULL,
    "calendario_pago_id" INTEGER NOT NULL,
    "monto_aplicado" DECIMAL(12,2) NOT NULL,
    "aplicado_a" VARCHAR(15) NOT NULL,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aplicacion_pago_pkey" PRIMARY KEY ("aplicacion_id")
);

-- CreateTable
CREATE TABLE "recargo" (
    "recargo_id" SERIAL NOT NULL,
    "calendario_pago_id" INTEGER NOT NULL,
    "monto_original" DECIMAL(12,2) NOT NULL,
    "monto_actual" DECIMAL(12,2) NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "motivo_modificacion" TEXT,
    "aplicado_en" DATE NOT NULL,
    "modificado_por" INTEGER,
    "modificado_en" TIMESTAMPTZ,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recargo_pkey" PRIMARY KEY ("recargo_id")
);

-- CreateTable
CREATE TABLE "movimiento_saldo" (
    "movimiento_id" SERIAL NOT NULL,
    "tutor_id" INTEGER NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "pago_id" INTEGER,
    "aplicacion_id" INTEGER,
    "descripcion" TEXT,
    "creado_por" INTEGER NOT NULL,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimiento_saldo_pkey" PRIMARY KEY ("movimiento_id")
);

-- CreateTable
CREATE TABLE "beca" (
    "beca_id" SERIAL NOT NULL,
    "nombre_beca" VARCHAR(60) NOT NULL,
    "criterio" "CriterioBeca" NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "beca_pkey" PRIMARY KEY ("beca_id")
);

-- CreateTable
CREATE TABLE "solicitud_beca" (
    "solicitud_id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "beca_id" INTEGER NOT NULL,
    "ciclo_id" INTEGER NOT NULL,
    "motivo" TEXT,
    "estado" "EstadoBeca" NOT NULL,
    "solicitada_por" INTEGER NOT NULL,
    "resuelta_por" INTEGER,
    "observaciones" TEXT,
    "fecha_solicitud" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "fecha_resolucion" TIMESTAMPTZ,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "solicitud_beca_pkey" PRIMARY KEY ("solicitud_id")
);

-- CreateTable
CREATE TABLE "asignacion_beca" (
    "asignacion_id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "beca_id" INTEGER NOT NULL,
    "ciclo_id" INTEGER NOT NULL,
    "solicitud_id" INTEGER,
    "estado" "EstadoBeca" NOT NULL,
    "fecha_asignacion" DATE NOT NULL,
    "fecha_retiro" DATE,
    "motivo_retiro" TEXT,
    "asignada_por" INTEGER NOT NULL,
    "retirada_por" INTEGER,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "asignacion_beca_pkey" PRIMARY KEY ("asignacion_id")
);

-- CreateTable
CREATE TABLE "ventana_inscripcion_temprana" (
    "ventana_id" SERIAL NOT NULL,
    "ciclo_id" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "beca_id" INTEGER NOT NULL,
    "activa" BOOLEAN DEFAULT true,
    "creado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "ventana_inscripcion_temprana_pkey" PRIMARY KEY ("ventana_id")
);

-- CreateTable
CREATE TABLE "calificacion" (
    "calificacion_id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "grupo_materia_id" INTEGER NOT NULL,
    "periodo_id" INTEGER NOT NULL,
    "tipo_evaluacion" "TipoEvaluacion" NOT NULL,
    "valor_numerico" DECIMAL(4,2),
    "valor_cualitativo" VARCHAR(5),
    "texto_observacion" TEXT,
    "texto_recomendacion" TEXT,
    "cuenta_para_promedio" BOOLEAN DEFAULT true,
    "registrada_por" INTEGER NOT NULL,
    "registrada_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificacion_pkey" PRIMARY KEY ("calificacion_id")
);

-- CreateTable
CREATE TABLE "asistencia" (
    "asistencia_id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "grupo_materia_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "estado" VARCHAR(10) NOT NULL,
    "justificacion" TEXT,
    "registrada_por" INTEGER NOT NULL,
    "registrada_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asistencia_pkey" PRIMARY KEY ("asistencia_id")
);

-- CreateTable
CREATE TABLE "documento" (
    "documento_id" SERIAL NOT NULL,
    "tipo_documento" VARCHAR(25) NOT NULL,
    "nombre_original" VARCHAR(255) NOT NULL,
    "ruta_almacen" TEXT NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "tamano_bytes" BIGINT NOT NULL,
    "hash_sha256" CHAR(64),
    "alumno_id" INTEGER,
    "tutor_id" INTEGER,
    "pago_id" INTEGER,
    "subido_por" INTEGER NOT NULL,
    "subido_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documento_pkey" PRIMARY KEY ("documento_id")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "notificacion_id" SERIAL NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "canal" VARCHAR(10) NOT NULL,
    "destinatario_tutor_id" INTEGER,
    "destinatario_email" VARCHAR(255) NOT NULL,
    "asunto" VARCHAR(160) NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "estado" VARCHAR(15) NOT NULL,
    "intentos" INTEGER DEFAULT 0,
    "error_ultimo" TEXT,
    "programada_para" TIMESTAMPTZ NOT NULL,
    "enviada_en" TIMESTAMPTZ,
    "alumno_id" INTEGER,
    "calendario_pago_id" INTEGER,
    "creada_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "eliminado_en" TIMESTAMPTZ,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("notificacion_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_codigo_key" ON "rol"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nombre_usuario_key" ON "usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_rol_usuario_id_rol_id_key" ON "usuario_rol"("usuario_id", "rol_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_permiso_modulo_usuario_id_modulo_key" ON "usuario_permiso_modulo"("usuario_id", "modulo");

-- CreateIndex
CREATE UNIQUE INDEX "token_revocado_jti_key" ON "token_revocado"("jti");

-- CreateIndex
CREATE UNIQUE INDEX "nivel_educativo_codigo_key" ON "nivel_educativo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "materia_clave_key" ON "materia"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "grupo_materia_grupo_id_materia_id_key" ON "grupo_materia"("grupo_id", "materia_id");

-- CreateIndex
CREATE UNIQUE INDEX "datos_fiscales_tutor_id_key" ON "datos_fiscales"("tutor_id");

-- CreateIndex
CREATE UNIQUE INDEX "alumno_matricula_key" ON "alumno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "alumno_curp_key" ON "alumno"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_alumno_tutor_id_alumno_id_key" ON "tutor_alumno"("tutor_id", "alumno_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscripcion_ciclo_alumno_id_ciclo_id_key" ON "inscripcion_ciclo"("alumno_id", "ciclo_id");

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol"("rol_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_asignado_por_fkey" FOREIGN KEY ("asignado_por") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_permiso_modulo" ADD CONSTRAINT "usuario_permiso_modulo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intento_login" ADD CONSTRAINT "intento_login_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_revocado" ADD CONSTRAINT "token_revocado_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_auditoria" ADD CONSTRAINT "log_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "nivel_educativo"("nivel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "ciclo_escolar"("ciclo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_materia" ADD CONSTRAINT "grupo_materia_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupo"("grupo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_materia" ADD CONSTRAINT "grupo_materia_materia_id_fkey" FOREIGN KEY ("materia_id") REFERENCES "materia"("materia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_materia" ADD CONSTRAINT "grupo_materia_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datos_fiscales" ADD CONSTRAINT "datos_fiscales_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumno" ADD CONSTRAINT "alumno_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "nivel_educativo"("nivel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_alumno" ADD CONSTRAINT "tutor_alumno_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_alumno" ADD CONSTRAINT "tutor_alumno_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifa" ADD CONSTRAINT "tarifa_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "ciclo_escolar"("ciclo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifa" ADD CONSTRAINT "tarifa_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "nivel_educativo"("nivel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_ciclo" ADD CONSTRAINT "inscripcion_ciclo_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_ciclo" ADD CONSTRAINT "inscripcion_ciclo_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "ciclo_escolar"("ciclo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_ciclo" ADD CONSTRAINT "inscripcion_ciclo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupo"("grupo_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_ciclo" ADD CONSTRAINT "inscripcion_ciclo_plan_pago_id_fkey" FOREIGN KEY ("plan_pago_id") REFERENCES "plan_pago"("plan_pago_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendario_pago" ADD CONSTRAINT "calendario_pago_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendario_pago" ADD CONSTRAINT "calendario_pago_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "ciclo_escolar"("ciclo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplicacion_pago" ADD CONSTRAINT "aplicacion_pago_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pago"("pago_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplicacion_pago" ADD CONSTRAINT "aplicacion_pago_calendario_pago_id_fkey" FOREIGN KEY ("calendario_pago_id") REFERENCES "calendario_pago"("calendario_pago_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recargo" ADD CONSTRAINT "recargo_calendario_pago_id_fkey" FOREIGN KEY ("calendario_pago_id") REFERENCES "calendario_pago"("calendario_pago_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recargo" ADD CONSTRAINT "recargo_modificado_por_fkey" FOREIGN KEY ("modificado_por") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_saldo" ADD CONSTRAINT "movimiento_saldo_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_saldo" ADD CONSTRAINT "movimiento_saldo_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pago"("pago_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_saldo" ADD CONSTRAINT "movimiento_saldo_aplicacion_id_fkey" FOREIGN KEY ("aplicacion_id") REFERENCES "aplicacion_pago"("aplicacion_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_saldo" ADD CONSTRAINT "movimiento_saldo_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_beca" ADD CONSTRAINT "solicitud_beca_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_beca" ADD CONSTRAINT "solicitud_beca_beca_id_fkey" FOREIGN KEY ("beca_id") REFERENCES "beca"("beca_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_beca" ADD CONSTRAINT "solicitud_beca_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "ciclo_escolar"("ciclo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_beca" ADD CONSTRAINT "solicitud_beca_solicitada_por_fkey" FOREIGN KEY ("solicitada_por") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_beca" ADD CONSTRAINT "solicitud_beca_resuelta_por_fkey" FOREIGN KEY ("resuelta_por") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_beca" ADD CONSTRAINT "asignacion_beca_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_beca" ADD CONSTRAINT "asignacion_beca_beca_id_fkey" FOREIGN KEY ("beca_id") REFERENCES "beca"("beca_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_beca" ADD CONSTRAINT "asignacion_beca_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "ciclo_escolar"("ciclo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_beca" ADD CONSTRAINT "asignacion_beca_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitud_beca"("solicitud_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_beca" ADD CONSTRAINT "asignacion_beca_asignada_por_fkey" FOREIGN KEY ("asignada_por") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_beca" ADD CONSTRAINT "asignacion_beca_retirada_por_fkey" FOREIGN KEY ("retirada_por") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventana_inscripcion_temprana" ADD CONSTRAINT "ventana_inscripcion_temprana_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "ciclo_escolar"("ciclo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventana_inscripcion_temprana" ADD CONSTRAINT "ventana_inscripcion_temprana_beca_id_fkey" FOREIGN KEY ("beca_id") REFERENCES "beca"("beca_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "calificacion_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "calificacion_grupo_materia_id_fkey" FOREIGN KEY ("grupo_materia_id") REFERENCES "grupo_materia"("grupo_materia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "calificacion_registrada_por_fkey" FOREIGN KEY ("registrada_por") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_grupo_materia_id_fkey" FOREIGN KEY ("grupo_materia_id") REFERENCES "grupo_materia"("grupo_materia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_registrada_por_fkey" FOREIGN KEY ("registrada_por") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pago"("pago_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_subido_por_fkey" FOREIGN KEY ("subido_por") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_destinatario_tutor_id_fkey" FOREIGN KEY ("destinatario_tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumno"("alumno_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "notificacion_calendario_pago_id_fkey" FOREIGN KEY ("calendario_pago_id") REFERENCES "calendario_pago"("calendario_pago_id") ON DELETE SET NULL ON UPDATE CASCADE;
