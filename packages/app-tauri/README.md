# @sga/app-tauri

Contenedor y Orquestador del Sistema de Gestión Académico.
- **Tecnologías**: Tauri v2 (Rust).
- **Responsabilidad**: Orquestar el arranque de PostgreSQL y del backend Fastify como sidecars y presentar el front-end React en un WebView2.

## PostgreSQL Portable
Para que la aplicación sea 100% portable y no dependa de DLLs externas, el orquestador asume la existencia de una distribución portátil de PostgreSQL.
1. Descarga los binarios de Windows x64 desde EnterpriseDB: `https://get.enterprisedb.com/postgresql/postgresql-16.3-1-windows-x64-binaries.zip`
2. Descomprime el archivo y coloca su contenido en la carpeta `src-tauri/pgsql/`. (Nota: Esta carpeta es ignorada por Git por su peso).

## Sidecars requeridos
El siguiente binario debe colocarse en `src-tauri/binaries/` y renombrarse con la tripleta del sistema:
1. `sga-back-x86_64-pc-windows-msvc.exe` (Servidor Fastify)
