Feature: Generar contraseñas únicas por boleto
  Como organizador de Arcana
  Quiero generar contraseñas únicas para cada invitación
  Para asegurar que solo el usuario autorizado pueda comprar su boleto.

  Scenario: The One Where Club Space Can't Skip MFA
    Given el organizador no ha completado MFA
    When intenta generar contraseñas
    Then el sistema solicita verificación MFA

  Scenario: The One Where Joey Gets Three Different Hashes
    Given el organizador tiene MFA completado
    When genera tres contraseñas únicas
    Then cada contraseña debe tener un hash distinto

  Scenario: The One Where Chandler Invites Sofia
    Given el organizador tiene MFA completado
    When genera una contraseña para Sofia
    Then el token queda asociado a Sofia y a un evento específico

  Scenario: The One Where Ross Misses The Deadline
    Given existe un token emitido con fecha de expiración
    When el token alcanza la fecha límite sin usarse
    Then el sistema marca el token como expirado

  Scenario: The One Where Phoebe Finds The Audit Entry
    Given existe un token utilizado
    When se revisa la bitácora de seguridad
    Then el sistema registra hora, usuario, token y evento

  Scenario: The One Where Monica Gets The VIP Email
    Given el organizador genera una contraseña para un invitado aprobado
    When el token es creado
    Then el sistema envía correo o alerta al usuario invitado

  Scenario: The One Where Rachel Proves The Token Is Valid
    Given existe un token activo asociado a un invitado
    When el invitado abre el link único
    Then el sistema valida el token correctamente

  Scenario: The One Where Joey Needs A Fresh Token
    Given el token asociado al invitado expiró
    When el organizador solicita regenerar token
    Then el sistema crea un nuevo token válido

  Scenario: The One Where Chandler Gets Blocked After 3 Attempts
    Given tres intentos fallidos con el mismo token
    When se registra el tercer intento
    Then el sistema bloquea el token y notifica al organizador

  Scenario: The One Where The Notification Module Syncs Perfectly
    Given se generan tokens
    When se ejecutan los módulos asociados
    Then MFA, bitácora y notificaciones se sincronizan correctamente
