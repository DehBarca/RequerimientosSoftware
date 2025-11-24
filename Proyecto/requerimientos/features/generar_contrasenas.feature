Feature: Generar contraseñas únicas por boleto
  Como organizador quiero generar contraseñas únicas para controlar el acceso exclusivo a mis eventos.

  Scenario: The One Where Joey Generates Three Tokens
    Given el organizador completó MFA
    When genera tres contraseñas únicas
    Then cada contraseña es diferente entre sí

  Scenario: The One Where Chandler Generates A Token For Monica
    Given el organizador completó MFA
    When genera una contraseña única para un invitado específico
    Then el token queda asociado al invitado correcto

  Scenario: The One Where Ross Misses The Expiration
    Given existe un token emitido con fecha de expiración
    When el token llega a su fecha límite sin usarse
    Then el sistema marca el token como expirado

