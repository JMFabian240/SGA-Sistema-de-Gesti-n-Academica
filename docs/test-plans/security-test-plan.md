# Plan de Pruebas de Seguridad (Security Testing & Pentesting)

## 1. Prerrequisitos de Ejecución
- **Backend y API**: Debe existir una infraestructura desplegada (Staging) accesible vía red para escaneos externos. (❌ Pendiente de despliegue).
- **Control de Accesos**: Rutas protegidas por JWT en el código. (✅ Cumplido en la arquitectura TRPC actual).

## 2. Herramientas y Frameworks
- **OWASP ZAP / Burp Suite**: Para análisis dinámico (DAST) e inyección de payloads maliciosos.
- **Snyk / npm audit**: Para análisis de composición de software (SCA) y vulnerabilidades en dependencias `node_modules`.
- **SonarQube / ESLint Security Plugins**: Para análisis estático de código (SAST) continuo.

## 3. Tipos de Pruebas y Áreas de Cobertura
1. **Autenticación y Sesiones (Broken Authentication)**:
   - *Técnica*: Intentos de fuerza bruta al endpoint de login; manipulación y reutilización de tokens JWT; verificación de tiempo de expiración.
2. **Inyección (SQLi & XSS)**:
   - *Técnica SQLi*: Enviar strings SQL maliciosos en los inputs de Zod. (Prisma actúa como mitigador nativo, pero se debe probar).
   - *Técnica XSS*: Intentar guardar scripts `<script>` en los nombres de alumnos o materias para ver si el frontend los renderiza escapados o no.
3. **Control de Acceso Inseguro (IDOR)**:
   - *Técnica*: Un usuario con rol "Docente" intentando modificar calificaciones de una materia que no le pertenece alterando el `id` en la petición TRPC.
4. **Rate Limiting y DDoS Capa 7**:
   - *Técnica*: Saturar de peticiones los endpoints expuestos públicos.
   - *Mitigación esperada*: Rechazo HTTP 429 por librerías como `fastify-rate-limit`.

## 4. Criterios de Aceptación Técnicos
- 0 vulnerabilidades de severidad "Alta" o "Crítica" en dependencias (`npm audit`).
- Tokens JWT deben carecer de información sensible (tarjetas, contraseñas) en su payload.
- Todos los inputs del cliente deben ser forzosamente filtrados por Zod antes de tocar la base de datos o el ORM.
- Ningún Error 500 debe retornar "Stack Traces" o detalles del servidor en producción.
