# RF-06, RF-07: Gestionar panel administrativo

| Campo | Descripción |
| :---- | :---- |
| **Nombre** | RF-06, RF-07: Gestionar panel administrativo |
| **Actor** | Gestor Administrativo |
| **Objetivo** | Acceder a una vista global del sistema para consultar información, emitir reportes, cotejar datos financieros/escolares y registrar pagos diarios, sin acceso a configuraciones críticas. |
| **Flujo Principal** | 1. El Gestor Administrativo inicia sesión y el sistema lo redirige al panel principal.<br>2. El Gestor navega por las secciones habilitadas: información escolar, financiera y captura de pagos.<br>3. El Gestor realiza consultas o cotejo de información financiera y académica.<br>4. El Gestor captura y registra un pago diario (flujo detallado en RF-43).<br>5. El sistema procesa el pago y actualiza los saldos correspondientes.<br>6. El Gestor genera y emite un reporte basado en la información consultada.<br>7. El sistema entrega el reporte en pantalla o para descarga. |
| **Flujo Alterno** | <b>A.</b> Intento de acceso a funciones críticas:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. El Gestor intenta acceder a una función de configuración crítica.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema muestra: "Acceso denegado: Permisos insuficientes".<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El Gestor es devuelto al panel seguro. |
| **Precondiciones** | El Gestor Administrativo debe tener sesión activa con su cuenta correctamente configurada. |
| **Postcondiciones** | Los pagos capturados quedan en la base de datos y los reportes se emiten. El sistema mantiene protegidas todas las configuraciones críticas. |
| **Reglas de negocio involucradas** | • El Gestor tiene lectura global y escritura limitada al registro de pagos diarios.<br>• Cualquier intento de alterar configuraciones críticas o estructuras de base de datos es bloqueado. |
