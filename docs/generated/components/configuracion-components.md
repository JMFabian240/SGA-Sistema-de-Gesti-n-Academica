# Componentes del Módulo de Configuración

Este documento detalla la estructura implementada para el módulo `configuracion` en `@sga/front`, el cual representa los ajustes globales de negocio de la institución.

## Rutas Asociadas (Nested Routing)
El enrutador inyecta un Layout principal en `/configuracion` y renderiza una única vista para la captura y actualización de datos:
- `/configuracion` -> Renderiza `ConfiguracionFormPage`

> [!NOTE]
> Dado que la configuración se maneja como un **Singleton** (una única fila o documento en el backend que aplica globalmente), se omitieron los flujos de "Listado" y "Detalles", dirigiendo al usuario directamente a la pantalla de edición.

## Layout

### `ConfiguracionLayout`
- **Ubicación:** `src/modules/configuracion/layouts/ConfiguracionLayout/ConfiguracionLayout.tsx`
- **Propósito:** Brinda un contenedor superior unificado con un título claro ("Ajustes Globales del Sistema") y preserva el menú lateral y superior (Header/Sidebar).

## Páginas y Componentes

### 1. Panel de Ajustes (Singleton)
- **Página:** `ConfiguracionFormPage.tsx`
- **Flujo de Trabajo:** 
  1. Al montar el componente, invoca a `trpc.configuracion.get` para rellenar los estados iniciales de `react-hook-form`.
  2. Expone campos divididos en dos categorías lógicas:
     - **Finanzas y Caja:** `montoRecargoDefecto` (input decimal) y `diasGraciaRecargo` (input numérico).
     - **Inscripciones y Notificaciones:** `plazoInscripcionDias` y `umbralesSmtpDias`.
  3. Para los `umbralesSmtpDias`, que en base de datos es un arreglo `[5,3,1]`, el formulario lo expone amigablemente como un string separado por comas `"5, 3, 1"` y realiza la transformación (parse) hacia un array numérico justo antes del `submit`.
  4. Dispara `trpc.configuracion.update` y muestra un mensaje de éxito efímero.

## Estilos
- **Archivo:** `ConfiguracionFormPage.module.css`
- Provee un diseño tipo tarjeta (Card) centrado y agrupado en columnas (Grid) para una lectura fluida de los parámetros técnicos.
