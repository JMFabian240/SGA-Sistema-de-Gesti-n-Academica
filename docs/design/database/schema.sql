-- =====================================================================
-- ESQUEMA DE BASE DE DATOS - COLEGIO SAN DIEGO
-- Motor: PostgreSQL
-- Generado a partir de modelo_relacional_V2.drawio y Requisitos V9
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. SEGURIDAD Y AUTENTICACIÓN
-- ---------------------------------------------------------------------

CREATE TABLE rol (
    rol_id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE usuario (
    usuario_id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(80) UNIQUE NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta TIMESTAMPTZ,
    ultimo_acceso TIMESTAMPTZ,
    debe_cambiar_pwd BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE usuario_rol (
    usuario_rol_id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuario(usuario_id),
    rol_id INT NOT NULL REFERENCES rol(rol_id),
    asignado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    asignado_por INT REFERENCES usuario(usuario_id),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ,
    UNIQUE(usuario_id, rol_id)
);

CREATE TABLE usuario_permiso_modulo (
    permiso_id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuario(usuario_id),
    modulo VARCHAR(30) NOT NULL,
    nivel VARCHAR(25) NOT NULL, -- LECTURA, LECTURA Y ESCRITURA, DENEGADO
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, modulo)
);

CREATE TABLE intento_login (
    intento_id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(usuario_id),
    nombre_usuario_intentado VARCHAR(80) NOT NULL,
    exitoso BOOLEAN NOT NULL,
    direccion_ip VARCHAR(45),
    user_agent TEXT,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token_revocado (
    id BIGSERIAL PRIMARY KEY,
    jti VARCHAR(36) UNIQUE NOT NULL,
    usuario_id INT NOT NULL REFERENCES usuario(usuario_id),
    revocado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMPTZ NOT NULL
);

-- ---------------------------------------------------------------------
-- 2. CONFIGURACIÓN Y AUDITORÍA
-- ---------------------------------------------------------------------

CREATE TABLE configuracion_global (
    configuracion_id INT PRIMARY KEY,
    monto_recargo_defecto NUMERIC(12,2) NOT NULL,
    dias_gracia_recargo INT NOT NULL,
    plazo_inscripcion_dias INT NOT NULL,
    umbrales_smtp_dias JSONB NOT NULL,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE log_auditoria (
    log_id BIGSERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(usuario_id),
    accion VARCHAR(10) NOT NULL,
    tabla_afectada VARCHAR(60) NOT NULL,
    registro_id VARCHAR(50) NOT NULL,
    valores_antes JSONB,
    valores_despues JSONB,
    fecha_hora TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    direccion_ip VARCHAR(45),
    descripcion TEXT
);

-- ---------------------------------------------------------------------
-- 3. ESTRUCTURA ACADÉMICA
-- ---------------------------------------------------------------------

CREATE TABLE nivel_educativo (
    nivel_id SERIAL PRIMARY KEY,
    codigo VARCHAR(15) UNIQUE NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    rvoe VARCHAR(40),
    orden INT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE ciclo_escolar (
    ciclo_id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE grupo (
    grupo_id SERIAL PRIMARY KEY,
    nivel_id INT NOT NULL REFERENCES nivel_educativo(nivel_id),
    ciclo_id INT NOT NULL REFERENCES ciclo_escolar(ciclo_id),
    nombre VARCHAR(10) NOT NULL,
    cupo_maximo INT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE materia (
    materia_id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    clave VARCHAR(20) UNIQUE NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE grupo_materia (
    grupo_materia_id SERIAL PRIMARY KEY,
    grupo_id INT NOT NULL REFERENCES grupo(grupo_id),
    materia_id INT NOT NULL REFERENCES materia(materia_id),
    docente_id INT REFERENCES usuario(usuario_id),
    UNIQUE(grupo_id, materia_id)
);

-- ---------------------------------------------------------------------
-- 4. ALUMNOS Y TUTORES
-- ---------------------------------------------------------------------

CREATE TABLE tutor (
    tutor_id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(120) NOT NULL,
    correo_electronico VARCHAR(255),
    telefono VARCHAR(15),
    direccion TEXT,
    curp VARCHAR(18),
    requiere_factura BOOLEAN DEFAULT FALSE,
    tipo_pago_habitual VARCHAR(15),
    saldo_a_favor NUMERIC(12,2) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE datos_fiscales (
    fiscal_id SERIAL PRIMARY KEY,
    tutor_id INT UNIQUE NOT NULL REFERENCES tutor(tutor_id),
    rfc VARCHAR(13) NOT NULL,
    razon_social VARCHAR(120) NOT NULL,
    regimen_fiscal VARCHAR(10),
    uso_cfdi VARCHAR(10),
    direccion_fiscal TEXT,
    codigo_postal VARCHAR(10),
    correo_facturacion VARCHAR(255),
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alumno (
    alumno_id SERIAL PRIMARY KEY,
    matricula VARCHAR(30) UNIQUE,
    curp VARCHAR(18) UNIQUE NOT NULL,
    nombre_completo VARCHAR(120) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) NOT NULL,
    nivel_id INT NOT NULL REFERENCES nivel_educativo(nivel_id),
    estado VARCHAR(20) CHECK (estado IN ('ACTIVO', 'BAJA_DEFINITIVA', 'BAJA_TEMPORAL', 'EGRESADO', 'TRANSICION_PENDIENTE')) NOT NULL,
    fecha_baja DATE,
    motivo_baja TEXT,
    dia_limite_pago INT DEFAULT 10,
    personas_autorizadas JSONB,
    tipo_sangre VARCHAR(10),
    alergias TEXT,
    padecimientos TEXT,
    observaciones TEXT,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE tutor_alumno (
    tutor_alumno_id SERIAL PRIMARY KEY,
    tutor_id INT NOT NULL REFERENCES tutor(tutor_id),
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    es_principal BOOLEAN DEFAULT FALSE,
    parentesco VARCHAR(20) NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tutor_id, alumno_id)
);

-- ---------------------------------------------------------------------
-- 5. FINANZAS Y PAGOS
-- ---------------------------------------------------------------------

CREATE TABLE tarifa (
    tarifa_id SERIAL PRIMARY KEY,
    ciclo_id INT NOT NULL REFERENCES ciclo_escolar(ciclo_id),
    nivel_id INT NOT NULL REFERENCES nivel_educativo(nivel_id),
    concepto VARCHAR(15) NOT NULL,
    monto NUMERIC(12,2) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE plan_pago (
    plan_pago_id SERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    meses INT NOT NULL,
    monto_mensual NUMERIC(12,2) NOT NULL,
    monto_diciembre NUMERIC(12,2),
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE inscripcion_ciclo (
    inscripcion_id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    ciclo_id INT NOT NULL REFERENCES ciclo_escolar(ciclo_id),
    grupo_id INT REFERENCES grupo(grupo_id),
    plan_pago_id INT NOT NULL REFERENCES plan_pago(plan_pago_id),
    fecha_ingreso DATE NOT NULL,
    es_ingreso_tardio BOOLEAN DEFAULT FALSE,
    estado_en_ciclo VARCHAR(20) NOT NULL,
    estado_financiero VARCHAR(20) NOT NULL,
    meses_adeudo INT DEFAULT 0,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ,
    UNIQUE(alumno_id, ciclo_id)
);

CREATE TABLE calendario_pago (
    calendario_pago_id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    ciclo_id INT NOT NULL REFERENCES ciclo_escolar(ciclo_id),
    concepto VARCHAR(25) NOT NULL,
    mes VARCHAR(15),
    fecha_vencimiento DATE NOT NULL,
    monto_original NUMERIC(12,2) NOT NULL,
    monto_pagado NUMERIC(12,2) DEFAULT 0,
    monto_recargo NUMERIC(12,2) DEFAULT 0,
    saldo_pendiente NUMERIC(12,2) NOT NULL,
    estado_cobro VARCHAR(15) NOT NULL CHECK (estado_cobro IN ('PENDIENTE', 'PAGADO', 'VENCIDO', 'CANCELADO')),
    liquidado_at TIMESTAMPTZ,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE pago (
    pago_id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    tutor_id INT NOT NULL REFERENCES tutor(tutor_id),
    fecha_pago DATE NOT NULL,
    monto_total NUMERIC(12,2) NOT NULL,
    metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('DEPOSITO,TRANSFERENCIA', 'TARJETA_DEBITO', 'TARJETA_CREDITO')),
    aplicado_a_saldo BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    registrado_por INT NOT NULL REFERENCES usuario(usuario_id),
    registrado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aplicacion_pago (
    aplicacion_id SERIAL PRIMARY KEY,
    pago_id INT NOT NULL REFERENCES pago(pago_id),
    calendario_pago_id INT NOT NULL REFERENCES calendario_pago(calendario_pago_id),
    monto_aplicado NUMERIC(12,2) NOT NULL,
    aplicado_a VARCHAR(15) NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recargo (
    recargo_id SERIAL PRIMARY KEY,
    calendario_pago_id INT NOT NULL REFERENCES calendario_pago(calendario_pago_id),
    monto_original NUMERIC(12,2) NOT NULL,
    monto_actual NUMERIC(12,2) NOT NULL,
    estado VARCHAR(15) NOT NULL,
    motivo_modificacion TEXT,
    aplicado_en DATE NOT NULL,
    modificado_por INT REFERENCES usuario(usuario_id),
    modificado_en TIMESTAMPTZ,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimiento_saldo (
    movimiento_id SERIAL PRIMARY KEY,
    tutor_id INT NOT NULL REFERENCES tutor(tutor_id),
    tipo VARCHAR(15) NOT NULL,
    monto NUMERIC(12,2) NOT NULL,
    pago_id INT REFERENCES pago(pago_id),
    aplicacion_id INT REFERENCES aplicacion_pago(aplicacion_id),
    descripcion TEXT,
    creado_por INT NOT NULL REFERENCES usuario(usuario_id),
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 6. BECAS Y DESCUENTOS
-- ---------------------------------------------------------------------

CREATE TABLE beca (
    beca_id SERIAL PRIMARY KEY,
    nombre_beca VARCHAR(60) NOT NULL,
    criterio VARCHAR(25) NOT NULL CHECK (criterio IN ('ACADEMICA', 'SOCIOECONOMICA', 'DEPORTIVA', 'CULTURAL', 'POR_HERMANOS', 'PROMOCION_TEMPRANA','EXTERNA')),
    porcentaje NUMERIC(5,2) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE solicitud_beca (
    solicitud_id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    beca_id INT NOT NULL REFERENCES beca(beca_id),
    ciclo_id INT NOT NULL REFERENCES ciclo_escolar(ciclo_id),
    motivo TEXT,
    estado VARCHAR(15) NOT NULL CHECK (estado IN ('ACTIVA', 'SUSPENDIDA', 'CANCELADA', 'VENCIDA')),
    solicitada_por INT NOT NULL REFERENCES usuario(usuario_id),
    resuelta_por INT REFERENCES usuario(usuario_id),
    observaciones TEXT,
    fecha_solicitud TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMPTZ,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE asignacion_beca (
    asignacion_id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    beca_id INT NOT NULL REFERENCES beca(beca_id),
    ciclo_id INT NOT NULL REFERENCES ciclo_escolar(ciclo_id),
    solicitud_id INT REFERENCES solicitud_beca(solicitud_id),
    estado VARCHAR(15) NOT NULL CHECK (estado IN ('ACTIVA', 'SUSPENDIDA', 'CANCELADA', 'VENCIDA')),
    fecha_asignacion DATE NOT NULL,
    fecha_retiro DATE,
    motivo_retiro TEXT,
    asignada_por INT NOT NULL REFERENCES usuario(usuario_id),
    retirada_por INT REFERENCES usuario(usuario_id),
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE ventana_inscripcion_temprana (
    ventana_id SERIAL PRIMARY KEY,
    ciclo_id INT NOT NULL REFERENCES ciclo_escolar(ciclo_id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    beca_id INT NOT NULL REFERENCES beca(beca_id),
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- 7. EVALUACIÓN Y DOCUMENTOS
-- ---------------------------------------------------------------------

CREATE TABLE calificacion (
    calificacion_id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    grupo_materia_id INT NOT NULL REFERENCES grupo_materia(grupo_materia_id),
    periodo_id INT NOT NULL,
    tipo_evaluacion VARCHAR(15) NOT NULL CHECK (tipo_evaluacion IN ('PARCIAL', 'BIMESTRE', 'BLOQUE', 'TRIMESTRE')),
    valor_numerico NUMERIC(4,2),
    valor_cualitativo VARCHAR(5),
    texto_observacion TEXT,
    texto_recomendacion TEXT,
    cuenta_para_promedio BOOLEAN DEFAULT TRUE,
    registrada_por INT NOT NULL REFERENCES usuario(usuario_id),
    registrada_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asistencia (
    asistencia_id SERIAL PRIMARY KEY,
    alumno_id INT NOT NULL REFERENCES alumno(alumno_id),
    grupo_materia_id INT NOT NULL REFERENCES grupo_materia(grupo_materia_id),
    fecha DATE NOT NULL,
    estado VARCHAR(10) NOT NULL,
    justificacion TEXT,
    registrada_por INT NOT NULL REFERENCES usuario(usuario_id),
    registrada_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documento (
    documento_id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(25) NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    ruta_almacen TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    tamano_bytes BIGINT NOT NULL,
    hash_sha256 CHAR(64),
    alumno_id INT REFERENCES alumno(alumno_id),
    tutor_id INT REFERENCES tutor(tutor_id),
    pago_id INT REFERENCES pago(pago_id),
    subido_por INT NOT NULL REFERENCES usuario(usuario_id),
    subido_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificacion (
    notificacion_id SERIAL PRIMARY KEY,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('ADEUDO', 'BECA', 'PAGO_VENCIDO', 'CIERRE_CICLO', 'DOCUMENTACION')),
    canal VARCHAR(10) NOT NULL,
    destinatario_tutor_id INT REFERENCES tutor(tutor_id),
    destinatario_email VARCHAR(255) NOT NULL,
    asunto VARCHAR(160) NOT NULL,
    cuerpo TEXT NOT NULL,
    estado VARCHAR(15) NOT NULL,
    intentos INT DEFAULT 0,
    error_ultimo TEXT,
    programada_para TIMESTAMPTZ NOT NULL,
    enviada_en TIMESTAMPTZ,
    alumno_id INT REFERENCES alumno(alumno_id),
    calendario_pago_id INT REFERENCES calendario_pago(calendario_pago_id),
    creada_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMPTZ
);
