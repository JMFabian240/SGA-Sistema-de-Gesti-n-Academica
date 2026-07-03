```markdown
| Campo | Descripción Técnica |
| :--- | :--- |
| **1. Autor(es)** | Sistema Generador SGA |
| **2. Nombre del caso de uso** | CU-M13-02: Consulta de Kárdex |
| **3. Actor principal** | Administrador / Coordinador |
| **4. Objetivo** | Visualizar la trayectoria académica completa de un alumno (todas sus calificaciones agrupadas por ciclo escolar). |
| **5. Precondiciones** | - Existen alumnos con calificaciones previas registradas. |
| **6. Postcondiciones** | El usuario visualiza la boleta/kárdex consolidado de manera estructurada. No hay mutaciones en BD. |
| **7. Flujo principal (Happy Path)** | **1. Actor:** Accede al módulo de Calificaciones > Kárdex.<br>**2. Sistema:** Muestra un buscador por nombre o matrícula.<br>**3. Actor:** Escribe un término de búsqueda (min. 3 caracteres).<br>**4. Sistema:** Ejecuta búsqueda local sobre el cache de `inscripciones` o lanza query tRPC.<br>**5. Sistema:** Muestra un dropdown con resultados coincidentes.<br>**6. Actor:** Clica sobre un Alumno.<br>**7. Sistema:** Lanza query tRPC `obtenerKardexCompleto` pasando el `alumnoId`.<br>**8. Sistema (Backend):** Prisma hace un `findMany` en `Calificacion` haciendo join con `Materia` y filtrando por `alumnoId`.<br>**9. Sistema (Frontend):** Recibe el array plano de calificaciones y ejecuta un `reduce` para agruparlo en un `Record<string, Calificacion[]>` usando el `ciclo` como llave.<br>**10. Sistema:** Muestra una Tarjeta (Card) por cada ciclo escolar, con una tabla interna que lista Nivel Académico, Materia y Calificación Final.<br>**11. Actor:** Analiza el resultado. |
| **8. Flujos alternos** | - **A1. Limpieza de búsqueda:** Al seleccionar un alumno, el buscador se limpia, pero el Kárdex activo se mantiene en pantalla. |
| **9. Flujos de excepción** | - **E1. Sin historial:** Si la consulta retorna un arreglo vacío, el sistema muestra un *Empty State* "Este alumno no cuenta con historial de calificaciones". |
| **10. Reglas de negocio** | - R1: El buscador se dispara solo después de 3 caracteres para no saturar memoria/red.<br>- R2: La agrupación en frontend asume que el ciclo viene embebido en el registro de calificación. |
```
