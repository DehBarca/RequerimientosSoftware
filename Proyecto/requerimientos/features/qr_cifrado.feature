Feature: Crear QR cifrado por boleto
  Como organizador y asistente de Arcana
  Quiero que cada boleto tenga un QR cifrado único
  Para asegurar un acceso controlado y difícil de falsificar.

  Scenario: The One Where Joey Gets Two Tickets And Two Different QRs
    Given Joey compró dos boletos confirmados para el mismo evento
    When el sistema genera los QR para los boletos de Joey
    Then cada boleto de Joey recibe un QR distinto y único

  Scenario: The One Where Rachel Cannot Read The QR Text
    Given existe un boleto pagado con un QR cifrado asignado
    When Rachel intenta leer el contenido del QR manualmente
    Then el contenido del QR no es comprensible en texto claro para un humano

  Scenario: The One Where Chandler Finds Ticket ID In The Payload
    Given existe un QR cifrado asociado a un boleto específico
    When el sistema desencripta internamente el contenido del QR
    Then el sistema identifica el identificador único del boleto correcto

  Scenario: The One Where Monica Won’t Get A QR Until She Pays
    Given Monica tiene un boleto con pago pendiente en Arcana
    When Monica intenta acceder al QR de ese boleto desde su perfil
    Then el sistema no muestra ningún QR mientras el pago esté pendiente

  Scenario: The One Where Joey Tries To Enter Twice
    Given Joey tiene un QR válido asociado a un boleto activo
    When Joey escanea su QR en la entrada por primera vez
    Then el sistema valida el acceso de Joey y marca el QR como usado

  Scenario: The One Where Ross Sees Invalid QR On Second Scan
    Given el QR de un boleto ya fue utilizado previamente en el evento
    When el mismo QR se escanea por segunda vez en la entrada
    Then el sistema rechaza el acceso indicando que el QR ya fue utilizado

  Scenario: The One Where Phoebe Leaves A Perfect Audit Trail
    Given el personal del evento escanea un QR válido desde la app de Arcana
    When el sistema procesa la validación del QR
    Then se registra en la bitácora la fecha, la hora y el resultado de la validación

  Scenario: The One Where Chandler Photoshops His QR
    Given Chandler altera manualmente la imagen de un QR que tenía en su teléfono
    When Chandler intenta validar ese QR manipulado en la entrada
    Then el sistema detecta la manipulación y bloquea la validación del QR

  Scenario: The One Where Rachel Uses The Arcana Scanner App
    Given la app móvil de Arcana incluye un lector de QR integrado
    And existe un QR válido asociado a un boleto de un asistente
    When el personal escanea el QR usando la app oficial de Arcana
    Then la app valida el QR y confirma el acceso correctamente

  Scenario: The One Where Monica Shows Her QR At The Entrance
    Given Monica tiene un boleto pagado visible en la sección Mis boletos
    When Monica abre el detalle de su boleto desde su perfil
    Then el QR cifrado correspondiente a ese boleto se muestra en pantalla

