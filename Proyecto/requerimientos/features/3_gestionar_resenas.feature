Feature: Gestión de reseñas de eventos
  Como asistente de un evento
  Quiero poder crear, editar y eliminar mis reseñas
  Para compartir mi experiencia y ayudar a otros usuarios

  Scenario: The One Where Rachel Opens The App After The Event
    Given el evento "The One Where Ross Got High" termina el 23/11/2025 a las 23:00
    When Rachel abre Arcana a las 23:10
    Then aparece el modal de reseña con 1-5 estrellas y caja de comentario

  Scenario: The One With Joey's Honest Review
    Given Joey asistió a "The One With Joey's New Brain"
    When Joey pone 2 estrellas y escribe "El DJ se fue a media fiesta"
    Then Ross ve exactamente esa reseña en su dashboard

  Scenario: The One Where Phoebe Changes Her Mind
    Given Phoebe dejó 3 estrellas y "El lugar estaba muy oscuro" en "The One With The Hypnosis Tape"
    When Phoebe entra a "Mis eventos" una semana después y pulsa "Editar reseña"
    Then puede cambiar a 5 estrellas y "Al final estuvo increíble"

  Scenario: The One Where Chandler Lowers His Rating
    Given Chandler tenía reseña de 4 estrellas
    When Chandler la edita a 1 estrella
    Then el promedio baja inmediatamente de 4.6 a 4.1

  Scenario: The One Where Monica's Review Triggers An Alert
    Given Monica tenía 3 estrellas en "The One With Monica's Thunder"
    When Monica edita a 2 estrellas
    Then Ross recibe alerta "Primera reseña negativa" o actualiza a crítica si ya había más

  Scenario: The One Where Chandler Improves His Review
    Given existía alerta crítica por 3 reseñas menores o iguales a 2
    When Chandler cambia su 1 estrella a 5 estrellas
    Then la alerta crítica baja a normal o desaparece

  Scenario: The One Where Rachel Deletes Her Review
    Given Rachel dejó reseña de 1 estrella en "The One After Vegas"
    When Rachel pulsa "Eliminar reseña" y confirma
    Then desaparece para ella y para el organizador Ross

  Scenario: The One Where Chandler Edits After Many Months
    Given Chandler dejó reseña en enero 2025
    When Chandler la edita o elimina el 23/11/2025
    Then Arcana lo permite sin problema

  Scenario: The One Where Rachel Can't Edit Monica's Review
    Given Rachel ve la reseña de Monica
    When Rachel intenta pulsar "Editar reseña"
    Then el botón no aparece

  Scenario: The One Where Joey's Deletion Fixes The Alert
    Given había alerta crítica por 3 reseñas negativas
    When Joey elimina su reseña de 1 estrella
    Then el contador baja a 2, el promedio sube y la alerta se degrada
