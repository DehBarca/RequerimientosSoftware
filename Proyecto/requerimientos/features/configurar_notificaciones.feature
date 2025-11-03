Feature: Configuración de tipos de notificación

  Como usuario registrado,
  Quiero poder configurar qué tipos de notificaciones deseo recibir,
  Para tener control sobre la información que me llega y evitar notificaciones innecesarias.

  Example: Notificaciones de correo electrónico
    Given el usuario está autenticado y accede a la sección de notificaciones
    When desactiva SMS y push, dejando activo únicamente el correo electrónico
    Then solo se envían notificaciones por correo electrónico

  Example: Notificación boleto agotado
    Given el usuario está autenticado y accede a la sección de notificaciones
    When selecciona SMS para alertas críticas y desactiva las demás
    Then las alertas de boletos agotados se envían solo por SMS

  Example: Configuración de notificaciones para eventos favoritos
    Given el usuario está autenticado y tiene eventos marcados como favoritos
    When activa notificaciones push solo para eventos favoritos
    Then recibe notificaciones push únicamente cuando hay actualizaciones en sus eventos favoritos

  Example: Desactivar notificaciones excepto confirmación de compra
    Given el usuario está autenticado y accede a la sección de notificaciones
    When desactiva todos los tipos de notificación excepto la confirmación de compra por correo
    Then solo recibe correos electrónicos de confirmación de compra

  Example: Activar todas las notificaciones en todos los canales
    Given el usuario está autenticado y accede a la sección de notificaciones
    When activa correo, SMS y push para todos los tipos de alerta
    Then recibe todas las notificaciones en los tres canales configurados

  Example: Configurar notificaciones solo para cambios de contraseña
    Given el usuario está autenticado y accede a la sección de notificaciones
    When activa correo y SMS únicamente para alertas de seguridad
    Then solo recibe notificaciones de seguridad por correo y SMS