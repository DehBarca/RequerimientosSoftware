Feature: Duplicar evento existente
  Como organizador de Arcana
  Quiero duplicar un evento previo
  Para crear eventos similares más rápido sin configurar todo desde cero.

  Scenario: The One Where The Organizer Duplicates a Successful Party
    Given que el organizador tiene sesión activa
    And que existe un evento creado por el organizador
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema crea un nuevo evento en estado borrador
    And el sistema muestra el formulario con los datos del evento copiados
    And el sistema exige definir nueva fecha, horario y capacidad
    And el nuevo evento aparece en el panel del organizador

  Scenario: The One Where The Assistant Tries To Duplicate
    Given que el usuario no está autenticado
    When un asistente intenta duplicar el evento
    Then el sistema niega la acción y muestra un mensaje de acceso no autorizado

  Scenario: The One Where The Organizer Tries To Copy Someone Else’s Event
    Given que el organizador tiene sesión activa
    And que existe un evento creado por otro organizador
    When el organizador intenta duplicar un evento de otro usuario
    Then el sistema niega la acción y muestra un mensaje de acceso no autorizado

  Scenario: The One With The Missing Original Event
    Given que el organizador tiene sesión activa
    And que el evento original ya no existe
    When el organizador selecciona la opción de duplicar el evento
    Then el sistema indica que el evento no está disponible para duplicarse
