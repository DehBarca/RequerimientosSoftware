Feature: Registrar Uso de Códigos
  Como un usuario autenticado, quiero que el sistema registre el uso de mi código exclusivo,
  para lograr un acceso seguro y trazable a eventos privados en Arcana.

  Background:
    Given el evento "Evento Privado" está activo
    And existe una base de datos de códigos

  # Happy Path
  Scenario: Usuario autenticado usa código válido exitosamente
    Given el usuario "user1@example.com" ha iniciado sesión con MFA
    And el código "ABC123" es válido y no ha sido usado
    When el usuario intenta usar el código "ABC123" para el evento "Evento Privado"
    Then el sistema valida el código exitosamente
    And el sistema registra el uso con estado "validado"
    And el usuario recibe notificación "Acceso aprobado"
    And el organizador puede ver la validación en el historial

  # Path Alternativo 1: Código válido pero límite de usos alcanzado
  Scenario: Código válido con límite de usos alcanzado
    Given el usuario "user2@example.com" ha iniciado sesión con MFA
    And el código "XYZ789" tiene límite de usos alcanzado
    When el usuario intenta usar el código "XYZ789" para el evento "Evento Privado"
    Then el sistema rechaza el código
    And el sistema registra el uso con estado "rechazado"
    And el usuario recibe notificación "Código alcanzó límite de usos"
    And el organizador recibe alerta de código agotado

  # Path Alternativo 2: Código caducado
  Scenario: Intento de uso con código caducado
    Given el usuario "user3@example.com" ha iniciado sesión con MFA
    And el código "EXP456" ha expirado
    When el usuario intenta usar el código "EXP456" para el evento "Evento Privado"
    Then el sistema rechaza el código
    And el sistema registra el uso con estado "caducado"
    And el usuario recibe notificación "Código expirado"
    And el organizador es notificado para emitir nuevo código

  # Path Alternativo 3: Compra diferida con sesión activa
  Scenario: Usuario verifica código pero completa acceso más tarde
    Given el usuario "user4@example.com" ha iniciado sesión con MFA
    And el código "DEF789" es válido y no ha sido usado
    When el usuario verifica el código "DEF789"
    And la sesión MFA está activa
    And el código no ha expirado
    And el usuario completa el acceso después
    Then el sistema registra el uso con estado "validado"
    And el historial muestra la validación completada

  # Excepción 1: Sesión MFA expirada
  Scenario: Intento de uso con sesión MFA expirada
    Given el usuario "user5@example.com" tenía sesión MFA activa
    And la sesión MFA ha expirado
    When el usuario intenta usar el código "GHI123"
    Then el sistema solicita reautenticación MFA
    And el sistema registra el intento con estado "pendiente"
    And el usuario recibe notificación "Reautenticación requerida"

  # Excepción 2: Intento de uso fraudulento
  Scenario: Detección de intentos fraudulentos desde múltiples dispositivos
    Given el usuario "user6@example.com" ha iniciado sesión con MFA
    And el código "JKL456" es válido
    When el sistema detecta intentos desde 2 dispositivos diferentes
    Then el sistema bloquea temporalmente el código "JKL456"
    And el sistema registra el intento con estado "sospechoso"
    And el organizador recibe alerta de fraude
    And se requiere verificación adicional del usuario

  # Excepción 3: Error en el módulo de validación
  Scenario: Fallo en el módulo de validación por error técnico
    Given el usuario "user7@example.com" ha iniciado sesión con MFA
    And el código "MNO789" es válido
    When ocurre un error en el módulo de validación
    Then el sistema pospone la validación
    And el sistema registra el intento con estado "pendiente"
    And el usuario recibe notificación "Error técnico, intente más tarde"
    And el organizador es notificado del error
    And se permite revalidación manual

  # Excepción 4: Código no validado tras compra
  Scenario: Rutina de contingencia para código no registrado tras compra
    Given el usuario "user8@example.com" compró un boleto
    And el código "PQR012" no se registró por error
    When el organizador detecta el error
    Then el sistema activa rutina de contingencia
    And se permite revalidación manual del código "PQR012"
    And el usuario y organizador son notificados
    And se asegura el acceso al evento

  # Scenario Outline para variantes de validación
  Scenario Outline: Validación de códigos con diferentes estados
    Given el usuario "<usuario>" ha iniciado sesión con MFA
    And el código "<codigo>" tiene estado "<estado_codigo>"
    When el usuario intenta usar el código "<codigo>" para el evento "<evento>"
    Then el sistema responde con "<resultado>"
    And el historial registra estado "<estado_historial>"
    And el usuario recibe notificación "<notificacion>"

    Examples:
      | usuario              | codigo  | estado_codigo | evento          | resultado | estado_historial | notificacion        |
      | user1@example.com    | ABC123  | válido        | Evento Privado  | aprobado  | validado         | Acceso aprobado     |
      | user2@example.com    | XYZ456  | usado         | Evento Privado  | rechazado | rechazado        | Código ya utilizado |
      | user3@example.com    | DEF789  | caducado      | Evento Privado  | rechazado | caducado         | Código expirado     |
      | user4@example.com    | GHI012  | inválido      | Evento Privado  | rechazado | rechazado        | Código inválido     |

  # Consulta de historial por organizador
  Scenario: Organizador consulta historial de validaciones en tiempo real
    Given existen 5 validaciones en el historial
    And el organizador está autenticado
    When el organizador solicita el historial de validaciones
    Then el sistema muestra todas las validaciones con fecha, hora, usuario, estado y evento
    And el organizador puede filtrar por estado "validado"
    And el organizador puede filtrar por fecha "20/10/2025"
