# Documentación de API - Módulo `configuracion`

Este módulo permite gestionar la configuración global del sistema, como los recargos, periodos de inscripción y umbrales de alerta (RF-90, RF-91).

## `configuracion.get` (Query)
Obtiene la configuración global actual del sistema. Si aún no existe, inicializa una con los valores por defecto (ej. recargo de $400, 5 días de gracia, 60 días de plazo para inscripciones).

- **Nivel de Acceso**: Protegido (`protectedProcedure`)
- **Inputs**: Ninguno
- **Outputs**:
  ```typescript
  {
    configuracionId: number;
    montoRecargoDefecto: number;
    diasGraciaRecargo: number;
    plazoInscripcionDias: number;
    umbralesSmtpDias: number[];
    actualizadoEn: Date | null;
  }
  ```
- **Errores Posibles**:
  - `UNAUTHORIZED`: Si el token es inválido o no se proporcionó.

---

## `configuracion.update` (Mutation)
Actualiza parcialmente los valores de la configuración global. Solo los parámetros que se incluyan en el payload serán modificados.

- **Nivel de Acceso**: Protegido (`protectedProcedure`)
- **Inputs** (todos opcionales, pero validados):
  ```typescript
  {
    montoRecargoDefecto?: number;   // >= 0
    diasGraciaRecargo?: number;     // Entero >= 0
    plazoInscripcionDias?: number;  // Entero >= 1
    umbralesSmtpDias?: number[];    // Máximo 5 umbrales (enteros >= 0)
  }
  ```
- **Outputs**:
  ```typescript
  // Retorna el mismo objeto de configuración actualizado
  {
    configuracionId: number;
    montoRecargoDefecto: number;
    diasGraciaRecargo: number;
    plazoInscripcionDias: number;
    umbralesSmtpDias: number[];
    actualizadoEn: Date | null;
  }
  ```
- **Errores Posibles**:
  - `BAD_REQUEST`: Si los valores de entrada no cumplen las reglas de validación (por ejemplo, números negativos o demasiados umbrales SMTP).
  - `UNAUTHORIZED`: Si el token es inválido.
  - `INTERNAL_SERVER_ERROR`: Si falla la actualización en la base de datos.
