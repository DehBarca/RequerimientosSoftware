Feature: Sistema de calificación de eventos
  Como usuario que asistió a un evento
  Quiero evaluar mi experiencia con estrellas
  Para reflejar la calidad del evento.

  Scenario: The One Where Joey Rates A Concert He Actually Attended
    Given Joey asistió al evento
    When califica el evento con 4 estrellas
    Then el sistema guarda la evaluación

  Scenario: The One Where Chandler Tries To Give 6 Stars
    Given Chandler asistió al evento
    When intenta calificar con 6 estrellas
    Then el sistema rechaza la calificación

  Scenario: The One Where Ross Wants To Change His Rating Again
    Given Ross ya evaluó ese evento
    When intenta evaluarlo de nuevo
    Then el sistema evita duplicado

  Scenario: The One Where Rachel Accidentally Sends Her Review Early
    Given Rachel asistió al evento
    When intenta enviar una calificación
    Then el sistema solicita confirmación

  Scenario: The One Where Monica Tries To Rate Her Own Dinner Event
    Given Monica es la organizadora del evento
    When intenta evaluarlo
    Then el sistema bloquea su evaluación

  Scenario: The One Where Phoebe Writes A Poem In The Review Box
    Given Phoebe asistió al evento
    When deja un comentario poético
    Then el sistema lo guarda como comentario opcional

  Scenario: The One Where Rachel Sees The Score Update Instantly
    Given Rachel evaluó el evento
    When su evaluación se procesa
    Then el promedio global se actualiza

  Scenario: The One Where Ross Finds An Event With Zero Stars
    Given el evento no tiene evaluaciones
    When Rachel lo visita
    Then ve “Aún sin calificaciones”
