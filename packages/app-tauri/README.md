# @sga/app-tauri

Contenedor y Orquestador del Sistema de Gestión Académico.
- **Tecnologías**: Tauri v2 (Rust).
- **Responsabilidad**: Orquestar el arranque de PostgreSQL y del backend Fastify como sidecars y presentar el front-end React en un WebView2.

## Sidecars requeridos
Los siguientes binarios deben colocarse en `src-tauri/binaries/` y renombrarse con la tripleta del sistema (ej: `-x86_64-pc-windows-msvc.exe`):
1. `initdb` (para inicializar el clúster de datos la primera vez)
2. `postgres` / `pg_ctl` (motor de base de datos portable)
3. `back` (backend Fastify compilado con `pkg` u otra herramienta)
