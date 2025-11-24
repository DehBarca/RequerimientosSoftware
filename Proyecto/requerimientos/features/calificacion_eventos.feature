Feature: Calificación de eventos
  Como asistente quiero calificar el evento al que asistí para compartir mi experiencia y ayudar a futuros asistentes.

  Scenario: The One Where Joey Rates A Concert He Actually Attended
    Given Joey asistió al evento y su asistencia fue registrada
    When Joey califica el evento con 4 estrellas
    Then el sistema guarda la calificación de Joey para ese evento

  Scenario: The One Where Chandler Tries To Give 6 Stars
    Given Chandler asistió al evento y su asistencia fue confirmada
    When Chandler intenta calificar el evento con 6 estrellas
    Then el sistema rechaza la calificación por estar fuera del rango permitido

  Scenario: The One Where Ross Wants To Change His Rating Again
    Given Ross ya dejó una calificación previa para ese mismo evento
    When Ross intenta enviar una nueva calificación para el mismo evento
    Then el sistema no permite registrar una segunda calificación para el mismo usuario

  Scenario: The One Where Rachel Accidentally Sends Her Review Early
    Given Rachel asistió al evento y está en la pantalla de calificación
    When Rachel intenta enviar su calificación por primera vez
    Then el sistema muestra un mensaje de confirmación antes de guardar la calificación

  Scenario: The One Where Phoebe Writes A Poem In The Review Box
    Given Phoebe asistió al evento y tiene acceso al formulario de reseña
    When Phoebe envía una calificación con un comentario adicional
    Then el sistema guarda la calificación junto con el comentario opcional

  Scenario: The One Where Monica Tries To Rate Her Own Dinner Event
    Given Monica es la organizadora principal del evento
    And el evento está asociado a la cuenta de Monica
    When Monica intenta calificar su propio evento
    Then el sistema bloquea la calificación por conflicto de interés

  Scenario: The One Where Chandler Checks His New Reputation Score
    Given el evento tiene varias calificaciones de distintos asistentes
    And Chandler es el organizador responsable del evento
    When Chandler consulta su perfil de organizador en Arcana
    Then el sistema muestra el promedio de calificación de sus eventos en su perfil

  Scenario: The One Where Joey Wants To Edit His Rating Later
    Given Joey ya dejó una calificación para un evento anterior
    When Joey intenta modificar la calificación que dejó para ese evento
    Then el sistema actualiza la calificación existente en lugar de crear una nueva entrada

  Scenario: The One Where Rachel Sees The Score Update Instantly
    Given existen calificaciones previas para el evento
    And Rachel está viendo la página del evento
    When Rachel envía una nueva calificación válida
    Then el promedio global del evento se actualiza inmediatamente en la interfaz

  Scenario: The One Where Ross Finds An Event With Zero Stars
    Given el evento todavía no tiene ninguna calificación registrada
    When Ross abre la página de detalle de ese evento
    Then el sistema muestra el mensaje Aún sin calificaciones para ese evento

