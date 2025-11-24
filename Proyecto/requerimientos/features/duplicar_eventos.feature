Feature: Duplicar evento existente
  Como organizador de Arcana
  Quiero duplicar un evento existente
  Para crear nuevos eventos similares sin configurar todo desde cero.

  Scenario: The One Where Joey Can’t Find The Duplicate Button
    Given el usuario actual es asistente y no organizador
    And existe un evento público visible en la plataforma
    When el usuario intenta buscar la opción para duplicar el evento
    Then la interfaz no muestra ninguna opción para duplicar el evento

  Scenario: The One Where Rachel Gets Logged Out Mid-Duplicate
    Given el organizador de Arcana inició sesión previamente
    And la sesión del organizador ha expirado durante la navegación
    And existe un evento creado por ese organizador
    When el organizador intenta acceder a la opción de duplicar ese evento
    Then el sistema redirige al flujo de inicio de sesión antes de continuar

  Scenario: The One Where Monica Tries To Copy Ross’ Party
    Given el organizador de Arcana tiene la sesión activa
    And el evento original pertenece a otro organizador distinto
    When el organizador intenta duplicar el evento de otro usuario
    Then el sistema bloquea la acción de duplicar por falta de permisos

  Scenario: The One Where Chandler Copies His Rooftop Party
    Given el organizador de Arcana tiene la sesión activa
    And existe un evento creado previamente por ese organizador
    When el organizador selecciona la opción de duplicar su propio evento
    Then el sistema crea un nuevo evento con título, categoría, lugar y descripción copiados

  Scenario: The One Where Phoebe Gets No Guests With The Copy
    Given el organizador tiene un evento original con asistentes y tokens generados
    And la sesión del organizador está activa
    When el organizador duplica ese evento desde el panel de administración
    Then el nuevo evento no incluye ni asistentes ni tokens de invitación previos

  Scenario: The One Where Ross Finds His New Event In Drafts
    Given el organizador ha duplicado un evento existente
    When el sistema termina de crear el nuevo evento
    Then el evento duplicado queda registrado con estado borrador

  Scenario: The One Where Joey Must Pick A New Date
    Given el organizador está editando un evento duplicado en estado borrador
    And el evento duplicado no tiene fecha ni horario definidos
    When el organizador intenta guardar el evento duplicado sin seleccionar fecha y horario
    Then el sistema muestra un mensaje indicando que debe definir fecha y horario para continuar

  Scenario: The One Where Monica Has To Set Capacity Again
    Given el organizador está configurando un evento duplicado en estado borrador
    And el campo de capacidad máxima de asistentes está vacío
    When el organizador intenta guardar el evento sin establecer la capacidad máxima
    Then el sistema muestra un mensaje indicando que debe definir la capacidad máxima

  Scenario: The One Where Chandler Reviews Before Saving
    Given el organizador ha completado los datos mínimos del evento duplicado
    When el organizador solicita revisar el evento antes de guardarlo definitivamente
    Then el sistema muestra una vista previa del evento duplicado con los datos copiados y modificados

  Scenario: The One Where Rachel Copies A Ghost Party
    Given el organizador tiene la sesión activa en Arcana
    And el evento original fue eliminado o no existe en la base de datos
    When el organizador intenta duplicar ese evento inexistente desde un enlace guardado
    Then el sistema muestra un mensaje de error indicando que el evento original no está disponible

