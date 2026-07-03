# Componentes del Módulo Dashboard

Este documento detalla los componentes generados e implementados para el módulo `dashboard` en `@sga/front`.

## Rutas Asociadas
- `/` (redirige a `/dashboard`)
- `/dashboard`: Renderiza el `MainLayout` y delega la vista a `DashboardPage`.

## Layouts Globales

### `MainLayout`
- **Ubicación:** `src/layouts/MainLayout/MainLayout.tsx`
- **Propósito:** Contenedor principal para la experiencia post-login. Mantiene la barra lateral (Sidebar), el encabezado superior (Header) y el contenedor central para el Outlet de rutas hijas.

### `Sidebar`
- **Ubicación:** `src/layouts/MainLayout/Sidebar/Sidebar.tsx`
- **Propósito:** Navegación principal de la plataforma. Muestra el branding y los enlaces a cada uno de los 12 submódulos principales del sistema académico utilizando íconos de `lucide-react`. Soporta estados activos (`isActive` via `NavLink`).

### `Header`
- **Ubicación:** `src/layouts/MainLayout/Header/Header.tsx`
- **Propósito:** Encabezado superior. Muestra el nombre de la vista actual y, a la derecha, el nombre del usuario logueado en sesión (extraído globalmente de `useAuth`) con la acción directa para cerrar sesión (`logout`).

## Páginas

### `DashboardPage`
- **Ubicación:** `src/modules/dashboard/pages/DashboardPage/DashboardPage.tsx`
- **Propósito:** Centro de operaciones "en vivo". Consume dos _queries_ desde el backend de manera simultánea para mostrar indicadores críticos del colegio.
- **Datos consumidos:**
  - `trpc.dashboard.obtenerMetricasInscripcion.useQuery()`
  - `trpc.dashboard.obtenerKpisFinancieros.useQuery()`
- **KPIs Mostrados (Card UI):**
  1. Total Alumnos
  2. Ingresos de Hoy (Formato Moneda MXN)
  3. Deudores Críticos (Formato Moneda MXN)
  4. Becas Activas
- **Paneles Intermedios:**
  - Últimos Pagos Registrados Hoy (Lista de estados recientes)
  - Top Deudores Críticos
- **Panel de Gráficos:**
  - Gráfica de barras usando `recharts` mostrando ingresos de los últimos 7 días.
- **Estados:**
  - Mientras las peticiones resuelven, muestra el componente `<Spinner centered size={40} />`.
