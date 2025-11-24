Feature: Crear nuevo evento
  Como organizador de Arcana
  Quiero crear un evento nuevo
  Para anunciar experiencias privadas a invitados exclusivos.

  Scenario: The One Where Joey Isn't Allowed To Create Events
    Given Joey es usuario asistente
    When intenta acceder a Crear evento
    Then el sistema niega el acceso

  Scenario: The One Where Chandler Forgot To MFA Again
    Given Monica es organizadora sin MFA completado
    When intenta crear un evento
    Then el sistema solicita completar MFA

  Scenario: The One Where Monica Leaves Category Empty
    Given Monica es organizadora autenticada
    When intenta crear un evento sin categoría
    Then el sistema solicita seleccionar categoría

  Scenario: The One Where Ross Schedules Backwards In Time
    Given Monica es organizadora autenticada
    When introduce hora de inicio posterior a hora de fin
    Then el sistema rechaza fecha u horario inválido

  Scenario: The One Where Phoebe Tries Zero Capacity
    Given Monica es organizadora autenticada
    When introduce capacidad igual a cero
    Then el sistema rechaza la capacidad ingresada

  Scenario: The One Where Rachel Invents A New Genre
    Given Monica es organizadora autenticada
    When selecciona categoría personalizada aprobada
    Then el sistema acepta la categoría

  Scenario: The One Where Chandler Writes A 5-Page Description
    Given Monica es organizadora autenticada
    When escribe descripción extensa válida
    Then el sistema acepta el contenido de la descripción

  Scenario: The One Where Monica Finds Her Event In Draft Mode
    Given Monica es organizadora autenticada
    When guarda el nuevo evento
    Then el sistema registra el evento en estado borrador

  Scenario: The One Where Joey Gets The Email Instantly
    Given un evento fue creado exitosamente
    When se realiza el registro
    Then el sistema envía notificación al organizador

  Scenario: The One Where Rachel Sees It On The Feed Immediately
    Given el evento se creó correctamente
    When el sistema habilita los módulos asociados
    Then el evento aparece disponible para el feed público
