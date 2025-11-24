
Feature: Recuperación de contraseña

  Como usuario registrado,
  Quiero poder recuperar mi contraseña mediante correo o SMS,
  Para acceder a mi cuenta si la olvido.

  Example: Recuperación por correo electrónico
    Given el usuario está en la pantalla de inicio de sesión
    When ingresa un correo válido para recuperación
    Then el sistema envía un enlace de recuperación por correo

  Example: Recuperación por SMS
    Given el usuario está en la pantalla de inicio de sesión
    When ingresa un número válido para recuperación
    Then el sistema envía un código por SMS

  Example: Correo no registrado
    Given el usuario está en la pantalla de inicio de sesión
    When ingresa un correo no registrado
    Then el sistema muestra un mensaje de error

  Example: Código expirado
    Given el usuario recibió un código por SMS
    When intenta usarlo después de 10 minutos
    Then el sistema rechaza el código y solicita generar uno nuevo
