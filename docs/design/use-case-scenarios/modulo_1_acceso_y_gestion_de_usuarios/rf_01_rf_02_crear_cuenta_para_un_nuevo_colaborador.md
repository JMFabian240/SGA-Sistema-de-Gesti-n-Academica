# RF-01, RF-02: Crear cuenta para un nuevo colaborador

| Campo | Descripción |
| :---- | :---- |
| **Nombre** | RF-01, RF-02: Crear cuenta para un nuevo colaborador |
| **Actor** | Administrador |
| **Objetivo** | Registrar a un nuevo empleado en el sistema, otorgándole credenciales de acceso y asignando automáticamente los permisos correspondientes a su rol en la institución. |
| **Flujo Principal** | 1. El Administrador ingresa al módulo de Gestión de Usuarios.<br>2. Selecciona la opción para crear una nueva cuenta o registrar colaborador.<br>3. El sistema despliega el formulario de registro en pantalla.<br>4. El Administrador ingresa el nombre, selecciona el rol (administrador, gestor administrativo o docente) y asigna una contraseña.<br>5. El Administrador confirma la acción haciendo clic en "Guardar".<br>6. El sistema valida que la información sea correcta.<br>7. El sistema crea la cuenta y habilita el acceso con los permisos predefinidos para el rol seleccionado.<br>8. El sistema muestra un mensaje de éxito y regresa a la lista de usuarios. |
| **Flujo Alterno** | <b>A.</b> Datos incompletos:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 6, el sistema detecta que falta algún campo obligatorio.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema resalta el campo y muestra alerta de campos obligatorios.<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El Administrador completa la información y repite el paso 5. <br><br><b>B.</b> Usuario duplicado:<br>&nbsp;&nbsp;&nbsp;&nbsp;1. En el paso 6, el sistema detecta que el nombre de usuario ya existe.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. El sistema advierte sobre el registro duplicado.<br>&nbsp;&nbsp;&nbsp;&nbsp;3. El Administrador usa un identificador distinto y reintenta. |
| **Precondiciones** | El Administrador debe haber iniciado sesión con los privilegios requeridos para acceder al panel de Gestión de Usuarios. |
| **Postcondiciones** | La cuenta del colaborador queda activa. El nuevo usuario puede iniciar sesión y visualizar únicamente los módulos que su rol le permite. |
| **Reglas de negocio involucradas** | • La creación de cuentas es función exclusiva del Administrador.<br>• Los roles asignables se limitan a: administrador, gestor administrativo o docente.<br>• Los permisos se heredan automáticamente según el rol seleccionado. |
