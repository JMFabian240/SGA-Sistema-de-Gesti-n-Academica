# RF-90 y RF-91: Configurar umbrales de morosidad y notificaciones

| Campo | Descripción |
| :---: | :---- |
| **Autor** | Francisco Xavier Viveros Salmones |
| **Nombre** | RF-90 y RF-91: Configurar umbrales de morosidad y notificaciones |
| **Actor** | Administrador |
| **Objetivo** | Personalizar las políticas del colegio respecto a los tiempos de gracia para cobrar penalizaciones, realizar bajas automáticas y ajustar los días de anticipación de los correos preventivos. |
| **Flujo Principal** | 1. El actor ingresa a la Configuración del Sistema en el panel administrativo.<br>2. Selecciona la pestaña "Políticas y Notificaciones".<br>3. El sistema muestra los parámetros actuales: días para recargo, días para alerta de morosidad, meses para baja automática, y días de anticipación para el envío de correos (ej. 5, 3 y 1 día).<br>4. El actor modifica los valores numéricos requeridos para adaptarlos a una nueva política escolar.<br>5. Hace clic en "Guardar Cambios".<br>6. El sistema valida que los valores sean lógicos (ej. que el primer aviso sea antes que el último aviso) y actualiza la base de datos de configuración global. |
| **Flujo Alterno** | <b>A.</b> Valores ilógicos:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 6, el sistema detecta que el umbral del "tercer aviso" es mayor al del "primer aviso".<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema rechaza el cambio y muestra un mensaje de error explicando la incoherencia lógica.<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El actor corrige los números y reintenta. |
| **Precondiciones** | El actor debe ser obligatoriamente el Administrador (Root/Admin), no disponible para Gestores. |
| **Postcondiciones** | Los motores automáticos de base de datos y tareas programadas (cron jobs/notificaciones SMTP) comenzarán a usar los nuevos umbrales inmediatamente en su próxima ejecución. |
| **Reglas de negocio involucradas** | La modificación de configuraciones críticas es una acción exclusiva del Administrador y debe quedar fuertemente registrada en la bitácora de auditoría. |
