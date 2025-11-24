Feature: Crear QR cifrado por boleto
  Como organizador de Arcana
  Quiero generar un QR cifrado por boleto
  Para validar acceso exclusivo en el evento.

  Scenario: The One Where Joey Gets Two Tickets And Two Different QRs
    Given Joey compra dos boletos válidos
    When se generan los QR correspondientes
    Then cada boleto tiene un QR único

  Scenario: The One Where Rachel Cannot Read The QR Text
    Given un boleto pagado con QR generado
    When Rachel intenta leer el contenido del QR manualmente
    Then el contenido no es legible en texto claro

  Scenario: The One Where Chandler Finds Ticket ID In The Payload
    Given un boleto con QR generado
    When el sistema desencripta el QR
    Then encuentra el ticketID correspondiente

  Scenario: The One Where Monica Won’t Get A QR Until She Pays
    Given Monica tiene un boleto pendiente de pago
    When intenta obtener su QR
    Then el sistema no genera el QR

  Scenario: The One Where Joey Tries To Enter Twice
    Given Joey escanea el QR en la entrada por primera vez
    When intenta escanearlo otra vez
    Then el sistema lo rechaza

  Scenario: The One Where Ross Sees Invalid QR On Second Scan
    Given Ross escanea su boleto
    When el sistema detecta que ya fue usado
    Then marca el QR como inválido

  Scenario: The One Where Phoebe Leaves A Perfect Audit Trail
    Given un QR válido es escaneado
    When se valida el acceso
    Then el sistema registra la validación en bitácora

  Scenario: The One Where Chandler Photoshops His QR
    Given Chandler altera manualmente su QR
    When intenta validarlo en el acceso
    Then el sistema lo bloquea

  Scenario: The One Where Rachel Uses The Arcana Scanner App
    Given un QR válido
    When se escanea con la app oficial de Arcana
    Then se valida correctamente

  Scenario: The One Where Monica Shows Her QR At The Entrance
    Given Monica tiene un boleto pagado
    When abre Mis Boletos
    Then su QR cifrado es visible
