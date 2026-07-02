# Plan de Pruebas de Aceptación (UAT y E2E) - SGA

## 1. Propósito
El objetivo de las pruebas de aceptación es validar que el sistema en su totalidad (Frontend + Backend + Base de Datos) cumple con los requerimientos de negocio y las expectativas del cliente final (Stakeholders). Estas pruebas simulan el comportamiento real de los usuarios en el navegador.

## 2. Alcance
Cubre los flujos críticos de negocio del sistema desde la perspectiva del usuario final (Administradores, Tutores, Alumnos y Docentes):
- **Autenticación y Autorización**: Login, recuperación de contraseña y barreras de acceso por roles.
- **Flujo de Inscripción**: Creación de un alumno, asignación a un grupo y plan de pago (End-to-End).
- **Flujo Financiero**: Generación de adeudos mensuales y el registro de pagos (simulación de caja).
- **Gestión Académica**: Registro y consulta de calificaciones de un grupo completo.
- **Interfaz de Usuario (UI/UX)**: Navegación, validación de formularios en el cliente y feedback visual (toasts, modales).

## 3. Estrategia y Entorno
- **Framework Recomendado**: Playwright o Cypress para pruebas E2E automatizadas en el Frontend.
- **Entorno (Ambiente de Staging)**: 
  - Las pruebas deben correr contra un ambiente que replique la infraestructura de producción (Vite UI corriendo + Backend TRPC + BD Postgres de Staging).
- **Ejecución**: 
  - **Automatizada**: Integrada en el pipeline CI/CD antes de la rama `main` o en despliegues.
  - **Manual (User Acceptance Testing - UAT)**: Sesiones guiadas con directivos de la escuela utilizando guiones de prueba paso a paso.

## 4. Tipos de Casos a Cubrir
1. **Pruebas de Flujo Principal (Golden Paths)**: El usuario navega sin cometer errores, los datos son ideales y el sistema debe responder exitosamente mostrando las pantallas de confirmación correctas.
2. **Pruebas de Flujo Alternativo (Manejo de Errores de Usuario)**: El usuario introduce datos inválidos (ej. pago superior al adeudo) y el sistema debe renderizar mensajes de error amigables sin crashear la página blanca.
3. **Validaciones de Roles**: Intentar acceder a la vista de "Configuración de Tarifas" logueado con un rol de 'Docente' y validar que el frontend redirija o bloquee correctamente.
4. **Resiliencia (Manejo de Red)**: Comportamiento del Frontend cuando el backend tarda en responder (spinners, carga perezosa).

## 5. Criterios de Aceptación
- 100% de los flujos críticos definidos por el cliente (UAT) deben ser validados y firmados antes de cualquier salida a Producción.
- Las pruebas automatizadas E2E no deben depender de datos remanentes; deben utilizar fixtures o bases de datos limpias.
- Todo error crítico (Crash de UI, pantalla blanca o error 500 no controlado) es bloqueante.
