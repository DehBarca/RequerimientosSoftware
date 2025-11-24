Feature: Duplicar evento existente
  Como organizador de Arcana
  Quiero duplicar un evento previo
  Para crear eventos similares más rápido sin configurarlo desde cero.

  Scenario: The One Where Joey Can’t Find The Duplicate Button
    Given el usuario no es organizador
    And existe un evento publicado
    When el usuario intenta duplicar el evento
    Then el sistema no muestra la opción de duplicar

  Scenario: The One Where Rachel Gets Logged Out Mid-Copy
    Given el organizador tenía sesión activa
    And la sesión del organizador ha expirado
    And existe un evento creado por el organizador
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema redirige al inicio de sesión

  Scenario: The One Where Monica Tries To Copy Ross’ Party
    Given el organizador tiene sesión activa
    And existe un evento creado por otro organizador
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema bloquea la duplicación del evento

  Scenario: The One Where Chandler Copies His Rooftop Party
    Given el organizador tiene sesión activa
    And existe un evento creado por el organizador
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema crea un nuevo evento con los datos básicos copiados

  Scenario: The One Where Phoebe Gets No Guests With The Copy
    Given el organizador tiene sesión activa
    And existe un evento creado por el organizador con asistentes y tokens generados
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema no copia asistentes ni tokens al nuevo evento

  Scenario: The One Where Ross Finds His New Event In Drafts
    Given el organizador tiene sesión activa
    And existe un evento creado por el organizador
    When el organizador selecciona la opción de duplicar el evento
    Then el nuevo evento queda en estado borrador

  Scenario: The One Where Joey Must Pick A New Date
    Given el organizador tiene sesión activa
    And existe un evento creado por el organizador
    And el evento duplicado se ha creado en borrador
    When el organizador intenta guardar el evento duplicado sin fecha ni horario
    Then el sistema muestra un error indicando que falta fecha y horario

  Scenario: The One Where Monica Has To Set Capacity Again
    Given el organizador tiene sesión activa
    And existe un evento creado por el organizador
    And el evento duplicado se ha creado en borrador
    When el organizador intenta guardar el evento duplicado sin capacidad máxima
    Then el sistema muestra un error indicando que falta la capacidad máxima

  Scenario: The One Where Chandler Reviews Before Saving
    Given el organizador tiene sesión activa
    And existe un evento creado por el organizador
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema muestra la vista previa del evento duplicado antes de guardar

  Scenario: The One Where Rachel Copies A Ghost Party
    Given el organizador tiene sesión activa
    And el evento original no existe
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema muestra un mensaje de error indicando que el evento original no existe
