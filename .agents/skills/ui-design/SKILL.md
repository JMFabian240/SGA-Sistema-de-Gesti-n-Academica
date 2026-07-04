---
name: ui-design
description: Usa esta skill cuando se te pida proponer interfaces, elegir colores, crear mockups, definir guías de estilo, o diseñar la experiencia de usuario antes de programar en React.
---
# UI Design & Mockups Skill

Define lineamientos visuales y prototipos (wireframes/mockups textuales) para estandarizar la interfaz gráfica antes de pasar a la implementación en `@sga/front-end`.

## Flujo de Trabajo
1. Analizar el caso de uso y requerimientos funcionales.
2. Generar un Mockup Textual (Wireframe en Markdown) que detalle la distribución de componentes (header, sidebar, main content, cards, forms).
3. Obtener aprobación del usuario antes de usar la skill de `front` para programarlo.

## Guía de Estilos Base (Tailwind)
- **Colores Principales**: Navy (`bg-[#001429]`, `bg-[#000f20]`) para la navegación y barras laterales.
- **Fondos**: Slate (`bg-[#f8fafc]`, `bg-slate-50`) para las áreas de contenido.
- **Acentos**: Tonalidades suaves con opacidad (ej. `bg-blue-600/10` para estado activo) y colores de contraste para llamadas a la acción.
- **Tipografía**: Font-sans estándar, con títulos robustos (`font-bold text-lg tracking-wide`).

## Micro-interacciones
- Todo elemento interactivo debe tener hover states, focus rings sutiles y transiciones fluidas (`transition-all duration-300`).
