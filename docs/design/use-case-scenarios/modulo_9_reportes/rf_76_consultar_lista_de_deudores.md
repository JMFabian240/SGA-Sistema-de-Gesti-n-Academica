# RF-76: Consultar lista de deudores

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-76: Consultar lista de deudores |
| **Actor** | Administrador y Gestor Administrativo |
| **Objetivo** | Facilitar la gestión de cobranza al agrupar de manera inteligente a las familias con adeudos, mostrando la deuda consolidada y los días de retraso. |
| **Flujo Principal** | 1. El actor ingresa al módulo de Reportes / Cobranza.<br>2. Hace clic en "Lista de deudores".<br>3. Selecciona un filtro opcional (por mes o periodo específico).<br>4. El sistema cruza las fechas de vencimiento con los pagos no realizados.<br>5. El sistema despliega un listado agrupado por padre/tutor que incluye: nombre del tutor, deuda consolidada de toda la familia, nombres de los alumnos con adeudo y días totales de retraso. |
| **Flujo Alterno** | <b>A.</b> Sin deudores:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 4, el sistema verifica que todos los alumnos están al corriente.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema despliega un mensaje felicitando o informando que "No se encontraron registros de adeudo para el periodo seleccionado". |
| **Precondiciones** | El sistema debe haber superado las fechas de corte (como el día 5 del mes) para generar estados vencidos u aplicar recargos. |
| **Postcondiciones** | El actor visualiza la lista en pantalla, lista para iniciar la labor de contacto y cobranza. |
| **Reglas de negocio involucradas** | • La lista debe agruparse obligatoriamente por Padre/Tutor y sumar la deuda de todos sus hijos para evitar notificaciones redundantes a la misma familia. |
