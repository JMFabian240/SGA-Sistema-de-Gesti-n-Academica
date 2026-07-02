# Componentes del Módulo Auth

Este documento detalla los componentes generados e implementados para el módulo `auth` en `@sga/front`.

## Rutas Asociadas
- `/login`: Renderiza el `AuthLayout` envolviendo a `LoginPage`. Rutas hijas:
  - `/login/` (index) -> `LoginPage`

## Layouts

### `AuthLayout`
- **Ubicación:** `src/layouts/AuthLayout/AuthLayout.tsx`
- **Propósito:** Contenedor de pantalla dividida (Split Screen) utilizado en pantallas públicas. La mitad izquierda muestra branding (oculta en móviles) y la mitad derecha centra un formulario u Outlet.
- **Props:** No recibe props directas, usa `<Outlet />`.

## Páginas

### `LoginPage`
- **Ubicación:** `src/modules/auth/pages/LoginPage/LoginPage.tsx`
- **Propósito:** Pantalla principal de autenticación. Utiliza el hook de tRPC `trpc.auth.login.useMutation` para autenticar al usuario.
- **Props:** No recibe props.
- **Estado interno:**
  - `email` (string)
  - `password` (string)
  - `error` (string)

## Hooks

### `useAuth`
- **Ubicación:** `src/hooks/useAuth.ts`
- **Propósito:** Almacén global (Zustand) que mantiene el JWT token y la información del usuario autenticado de forma síncrona en memoria, inicializando desde `localStorage`.
- **Valores/Métodos:**
  - `token`: `string | null`
  - `usuario`: `any | null`
  - `setToken(token: string)`
  - `setUsuario(usuario: any)`
  - `logout()`

## Integración con tRPC y React Query
- Se configuró `lib/trpc.ts` para extraer tipos de `AppRouter` del backend.
- En `App.tsx` se envuelve la app con `<trpc.Provider>`, `<QueryClientProvider>` y `<RouterProvider>`.
- Las rutas se definen en `src/router/index.tsx` empleando HOCs como `<ProtectedRoute>` y `<PublicRoute>` para controlar accesos basados en el store de `useAuth`.
