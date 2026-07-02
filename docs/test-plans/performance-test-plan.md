# Plan de Pruebas de Rendimiento (Performance & Load Testing)

## 1. Prerrequisitos de Ejecución
- **Backend**: Desarrollo completo de rutas TRPC. (✅ Cumplido).
- **Frontend**: Componentes estáticos compilados y servidos para medición de Web Vitals (❌ Pendiente).
- **Base de Datos**: Instancia aislada poblada con volúmenes masivos de datos sintéticos (Seeders masivos).

## 2. Herramientas y Frameworks
- **Artillery / k6**: Para inyección de carga concurrente sobre los endpoints de TRPC.
- **Lighthouse (CI)**: Para auditoría automatizada de Web Core Vitals (LCP, FID, CLS) en el cliente.
- **Prisma Studio / pg_stat_statements**: Para análisis de cuellos de botella en consultas SQL (N+1).

## 3. Tipos de Pruebas y Métricas Objetivo
1. **Load Testing (Prueba de Carga)**:
   - *Objetivo*: Evaluar el sistema bajo la carga esperada en picos (ej. época de inscripciones).
   - *Métrica técnica*: 500 VUs (Virtual Users) durante 5 minutos.
   - *Aceptación*: Latencia p95 < 300ms. Error rate < 0.1%.
2. **Stress Testing (Prueba de Estrés)**:
   - *Objetivo*: Determinar el punto de quiebre (Crash Point) del servidor de Node.js / Base de datos.
   - *Métrica técnica*: Incremento lineal hasta 5,000 VUs.
   - *Aceptación*: Degradación elegante (Rate limiting HTTP 429) sin colapso del proceso (OOM - Out of Memory).
3. **Frontend Performance (Lighthouse)**:
   - *Objetivo*: Tiempo de carga en navegadores de gama media.
   - *Métrica técnica*: LCP (Largest Contentful Paint) < 2.5s. TTI (Time to Interactive) < 3.0s.

## 4. Estrategia de Ejecución
1. Definir scripts de k6 que consuman el router TRPC mediante requests HTTP crudos a `/api/trpc/...`.
2. Monitorizar el consumo de CPU/Memoria del contenedor Node.js durante la prueba.
3. Analizar logs de Slow Queries en PostgreSQL.
