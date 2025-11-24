Feature: Crear QR cifrado por boleto
  Como organizador de Arcana
  Quiero generar un QR cifrado por boleto
  Para validar el acceso exclusivo al evento.

  Scenario: The One Where Joey Gets Two Tickets And Two Different QRs
    Given Joey compra dos boletos válidos para el mismo evento
    When se generan los QR para los boletos de Joey
    Then cada boleto tiene un QR distinto

  Scenario: The One Where Rachel Cannot Read The QR Text
    Given existe un boleto pagado con QR generado
    When Rachel intenta leer manualmente el contenido del QR
    Then el contenido del QR no es legible en texto claro

  Scenario: The One Where Chandler Finds Ticket ID In The Payload
    Given existe un boleto asociado a un QR cifrado
    When el sistema desencripta el contenido del QR
    Then el sistema encuentra el identificador único del boleto correcto

  Scenario: The One Where Monica Won’t Get A QR Until She Pays
    Given Monica tiene un boleto con pago pendiente
    When Monica intenta obtener el QR de su boleto
    Then el sistema no genera el QR para el boleto pendiente

  Scenario: The One Where Joey Tries To Enter Twice
    Given existe un QR válido asociado a un boleto
    When Joey escanea su QR en la entrada por primera vez
    Then el sistema autoriza el acceso al evento

  Scenario: The One Where Ross Sees Invalid QR On Second Scan
    Given el QR ya fue usado previamente
    When Joey intenta escanear el mismo QR por segunda vez
    Then el sistema rechaza el acceso por reutilización de QR

  Scenario: The One Where Phoebe Leaves A Perfect Audit Trail
    Given existe un QR válido asociado a un boleto
    When el personal del evento escanea el QR con la app de Arcana
    Then el sistema registra el escaneo en la bitácora de seguridad

  Scenario: The One Where Chandler Photoshops His QR
    Given existe un QR válido asociado a un boleto
    When Chandler altera la imagen del QR y la vuelve a subir
    Then el sistema bloquea el QR manipulado

  Scenario: The One Where Rachel Uses The Arcana Scanner App
    Given existe un lector de QR integrado en la app de Arcana
    And existe un QR válido asociado a un boleto
    When el personal del evento escanea el QR con la app de Arcana
    Then la app de Arcana valida correctamente el QR

  Scenario: The One Where Monica Shows Her QR At The Entrance
    Given Monica tiene un boleto pagado visible en su cuenta
    When Monica abre la sección Mis boletos en su perfil
    Then el QR cifrado del boleto de Monica es visible en pantalla
