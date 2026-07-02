# Plan de Pruebas Unitarias - Backend SGA

## 1. Propósito
El objetivo de las pruebas unitarias es validar la lógica de negocio, los esquemas de validación (Zod) y los controladores (TRPC Routers) de forma completamente aislada de la base de datos. Esto garantiza una ejecución ultra rápida (menos de 1 segundo) y fomenta el desarrollo iterativo continuo.

## 2. Alcance
Cubre todos los módulos base del backend ubicados en `src/modules/*`:
- `alumnos`
- `auth`
- `becas`
- `calificaciones`
- `configuracion`
- `grupos`
- `inscripciones`
- `pagos`
- `tutores`

## 3. Estrategia y Entorno
- **Framework**: Vitest (`npm run test`)
- **Simulación (Mocking)**: Se utiliza `vitest-mock-extended` para falsear el cliente de Prisma.
- **Configuración de Mocks**: El archivo clave es `tests/setup/prisma-mock.ts`, el cual inyecta globalmente a través de `vitest.config.ts` las respuestas predecibles sin conectarse a la BD.
- **Patrón de Ejecución**: Paralelismo habilitado por defecto.

## 4. Tipos de Casos a Cubrir
1. **Validaciones de Esquema (Zod)**: Comprobar que los DTOs entrantes cumplan restricciones de longitud, tipos primitivos, enums, rangos y transformaciones.
2. **Lógica de Negocio Pura**: Evaluaciones matemáticas (ej. calcular promedios, prorrateos de pagos) antes del acceso a datos.
3. **Manejo de Errores de TRPC**: Asegurar que las excepciones controladas (`TRPCError`) arrojen los códigos HTTP internos adecuados (`BAD_REQUEST`, `UNAUTHORIZED`, etc.).
4. **Respuesta Estructural**: Verificar que las funciones devuelven el esquema (Type) que el Frontend espera recibir.

## 5. Criterios de Aceptación
- 100% de los casos unitarios deben pasar en verde bajo el comando `npm run test`.
- Las pruebas no deben tomar más de `2000ms` en su ejecución global.
- Ninguna prueba debe escribir o leer de PostgreSQL de forma incidental.
