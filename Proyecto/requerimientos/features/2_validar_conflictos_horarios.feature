Feature: Validar conflictos de horarios y lugares
  Como organizador de eventos
  Quiero que el sistema detecte cruces de horarios y lugares
  Para evitar programar eventos que se solapen

  @conflictos @happy-path
  Scenario: The One Where Ross Can't Book The Same Place Twice
    Given Ross tiene reservado "The One With The Videotape" en Central Perk el 15/12/2025 de 19:00 a 22:00
    When Ross intenta crear "The One Where Ross Is Fine" en Central Perk el 15/12/2025 de 20:30 a 23:30
    Then el sistema muestra "El lugar Central Perk ya está reservado por tu evento The One With The Videotape"
    And bloquea la creación por defecto

  @conflictos @ruta-alternativa
  Scenario: The One Where Monica Has Two Events At The Same Time
    Given Monica tiene "The One With All The Cheesecakes" el 20/11/2025 de 18:00 a 21:00 en su departamento
    When Monica intenta crear "The One With The Embryos" el 20/11/2025 de 19:30 a 22:30 en el museo
    Then aparece mensaje "Ya tienes otro evento programado en ese horario"
    And ofrece opción "Crear de todos modos"

  @conflictos @ruta-alternativa
  Scenario: The One Where Chandler's Events Don't Overlap
    Given Chandler tiene "The One With Chandler's Dad" el 25/11/2025 de 18:00 a 19:30 en Las Vegas
    When Chandler crea "The One In Vegas" el 25/11/2025 de 19:30 a 23:00 en Las Vegas
    Then el evento se crea sin advertencia

  @conflictos @ruta-alternativa
  Scenario: The One Where Phoebe Books Different Days
    Given Phoebe tiene "The One With The Holiday Armadillo" el 05/12/2025 de 21:00 a 23:00
    When Phoebe crea "The One With The Routine" el 12/12/2025 de 21:00 a 23:00
    Then se crea normalmente

  @conflictos @edicion
  Scenario: The One Where Rachel Edits Her Event
    Given Rachel tiene "The One Where Rachel Finds Out" el 10/12/2025 de 20:00 a 22:00
    When Rachel edita "The One With Rachel's New Dress" y cambia su horario a 10/12/2025 de 19:30 a 21:30
    Then aparece el mismo modal de conflicto que al crear

  @conflictos @borde
  Scenario: The One Where Joey Forces Event Creation
    Given aparece advertencia de conflicto
    When Joey pulsa "Crear de todos modos" y marca el checkbox "Entiendo el riesgo y quiero continuar"
    Then el evento se crea y queda registro de creación forzada

  @conflictos @borde
  Scenario: The One Where Gunther And Ross Don't Conflict
    Given Gunther tiene reservado Central Perk el 15/12/2025 de 20:00 a 22:00
    When Ross crea un evento en Central Perk el 15/12/2025 de 20:30 a 23:30
    Then no aparece ningún conflicto

  @conflictos @borde
  Scenario: The One Where Joey Has A Five Minute Overlap
    Given Joey tiene "The One With Joey's New Brain" el 18/12/2025 de 19:00 a 22:00
    When Joey intenta crear "The One With The Proposal" el 18/12/2025 de 21:55 a 23:30
    Then se detecta conflicto y bloquea por defecto

  @conflictos @colaboradores
  Scenario: The One Where Chandler Collaborates With Ross
    Given Chandler es colaborador de Ross
    And Ross tiene "The One With The Red Sweater" el 22/12/2025 de 18:00 a 21:00
    When Chandler intenta crear un evento el 22/12/2025 de 19:00 a 22:00
    Then aparece conflicto aunque no sea el dueño del evento original
