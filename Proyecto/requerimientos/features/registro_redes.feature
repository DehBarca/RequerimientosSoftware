Feature: Registro con redes sociales

  Como usuario nuevo,
  Quiero poder registrarme usando mis cuentas de redes sociales,
  Para agilizar el proceso y personalizar mi perfil automáticamente.

  Example: Registro con Google
    Given el usuario está en la pantalla de registro
    When inicia sesión con su cuenta de Gmail
    Then se crea el perfil automáticamente con los datos de Google

  Example: Registro con Facebook
    Given el usuario está en la pantalla de registro
    When conecta su cuenta de Facebook
    Then se sincroniza su foto de perfil y se completa el registro

  Example: Registro con X
    Given el usuario está en la pantalla de registro
    When usa su cuenta de X para autenticarse
    Then se importan sus datos básicos y se crea el perfil

  Example: Registro con Google y luego vinculación con Facebook
    Given el usuario ya se registró con Google
    When agrega Facebook como método adicional
    Then ambos métodos quedan vinculados y se sincronizan los datos

  Example: Registro con Facebook y personalización del nombre
    Given el usuario está en la pantalla de registro
    When se registra con Facebook y edita su nombre antes de confirmar
    Then el perfil se crea con el nombre personalizado

  Example: Registro con Google y carga manual de foto
    Given el usuario está en la pantalla de registro
    When se registra con Google y sube una foto distinta a la de su cuenta
    Then el perfil se crea con la foto personalizada

  Example: Registro con X y sincronización de foto y nombre
    Given el usuario está en la pantalla de registro
    When se registra con X y acepta importar foto y nombre automáticamente
    Then el perfil se crea con la foto y nombre de X

  Example: Registro con Google y desactivación de sincronización de contactos
    Given el usuario está en la pantalla de registro
    When se registra con Google y desactiva la opción de sincronizar contactos
    Then el perfil se crea sin importar contactos