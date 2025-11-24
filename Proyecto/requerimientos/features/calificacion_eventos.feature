Feature: Sistema de calificación de eventos
  Como usuario que asistió a un evento
  Quiero evaluar mi experiencia con estrellas
  Para reflejar la calidad del evento.

  Scenario: The One Where Joey Rates A Concert He Actually Attended
    Given Joey asistió al evento
    When Joey califica el evento con 4 estrellas
    Then el sistema guarda la calificación de Joey correctamente

  Scenario: The One Where Chandler Tries To Give 6 Stars
    Given Chandler asistió al evento
    When Chandler intenta calificar el evento con 6 estrellas
    Then el sistema rechaza la calificación fuera de rango

  Scenario: The One Where Ross Wants To Change His Rating Again
    Given Ross asistió al evento y ya calificó anteriormente
    When Ross intenta calificar el mismo evento de nuevo
    Then el sistema no permite calificar el evento más de una vez

  Scenario: The One Where Rachel Accidentally Sends Her Review Early
    Given Rachel asistió al evento
    When Rachel intenta enviar su calificación por primera vez
    Then el sistema muestra un mensaje de confirmación de envío

  Scenario: The One Where Phoebe Writes A Poem In The Review Box
    Given Phoebe asistió al evento
    When Phoebe envía una calificación con un comentario poético
    Then el sistema registra el comentario opcional junto con la calificación

  Scenario: The One Where Monica Tries To Rate Her Own Dinner Event
    Given Monica es la organizadora del evento
    And el evento pertenece a Monica
    When Monica intenta calificar su propio evento
    Then el sistema bloquea la calificación del organizador sobre su propio evento

  Scenario: The One Where Chandler Checks His New Reputation Score
    Given existen varias calificaciones previas para el evento
    And Chandler es el organizador del evento
    When Chandler abre el perfil del organizador del evento
    Then la calificación promedio del evento se refleja en el perfil del organizador

  Scenario: The One Where Joey Wants To Edit His Rating Later
    Given Joey asistió al evento
    And Joey ya tiene una calificación registrada para ese evento
    When Joey intenta editar su calificación anterior
    Then el sistema actualiza la calificación existente en lugar de crear una nueva

  Scenario: The One Where Rachel Sees The Score Update Instantly
    Given Rachel asistió al evento
    And existen varias calificaciones previas para el evento
    When Rachel envía una nueva calificación válida
    Then el promedio global del evento se actualiza después de la nueva calificación

  Scenario: The One Where Ross Finds An Event With Zero Stars
    Given el evento no tiene calificaciones previas
    When Ross visita la página del evento
    Then el evento muestra el mensaje Aún sin calificaciones
