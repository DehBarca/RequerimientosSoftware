Feature: Crear evento
  Como organizador quiero crear un evento para poder publicarlo en Arcana.

  Scenario: The One Where Monica Creates A New Event
    Given el organizador está autenticado
    When crea un evento ingresando categoría, horario, capacidad y descripción
    Then el sistema registra el evento correctamente

  Scenario: The One Where Ross Forgets The Category
    Given el organizador está autenticado
    When intenta crear un evento sin categoría
    Then el sistema solicita seleccionar una categoría válida

  Scenario: The One Where Joey Schedules Backwards
    Given el organizador está autenticado
    When introduce una hora de inicio posterior a la hora de fin
    Then el sistema rechaza la fecha u horario inválido

