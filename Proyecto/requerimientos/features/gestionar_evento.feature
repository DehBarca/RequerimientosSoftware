Feature: Cancelar o editar evento
  Como organizador de eventos en Arcana
  Quiero poder editar o cancelar un evento
  Para mantener la información actualizada y gestionar cambios imprevistos

  Scenario: Editar un evento activo correctamente
    Given existe un evento activo con aforo suficiente y boletos vendidos
    When el organizador cambia la descripción del evento
    Then el sistema guarda los cambios del evento

  Scenario: Intento de reducir el aforo por debajo de los boletos vendidos
    Given existe un evento activo con aforo menor al número de boletos vendidos propuesto
    When el organizador intenta reducir el aforo por debajo de los boletos vendidos
    Then el sistema no permite guardar los cambios en el evento

  Scenario: Cancelar un evento activo
    Given existe un evento activo con asistentes registrados
    When el organizador cancela el evento
    Then el sistema marca el evento como cancelado y bloquea nuevas compras
