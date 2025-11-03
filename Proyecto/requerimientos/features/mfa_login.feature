Feature: Autenticación Multifactor
  Como usuario
  Quiero validar mi identidad con MFA
  Para asegurar el acceso a mi cuenta

  Scenario: Usuario ingresa correctamente correo y contraseña
    Given el usuario ingresó su correo y contraseña válidos
    When el sistema solicita el código MFA
    Then el usuario debe ver una pantalla para ingresar el código

  Scenario: Usuario ingresa código MFA incorrecto tres veces
    Given el usuario se encuentra en la pantalla de MFA
    When el usuario ingresa un código incorrecto tres veces
    Then el sistema debe bloquear temporalmente su cuenta

  Scenario: Usuario recibe el código por correo
    Given el usuario tiene configurado MFA por correo electrónico
    When el sistema envía el código
    Then el usuario debe recibirlo en su bandeja de entrada
