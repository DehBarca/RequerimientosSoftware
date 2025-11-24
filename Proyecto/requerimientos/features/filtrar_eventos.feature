Feature: Filtrar eventos por categoría
  Como usuario de Arcana
  Quiero filtrar el catálogo de eventos por categoría
  Para encontrar más rápido los eventos que me interesan

  Scenario: Filtrar eventos por una categoría con resultados
    Given existen eventos en diferentes categorías
    And el usuario se encuentra en la pantalla de exploración de eventos
    When el usuario filtra por la categoría Conciertos privados
    Then el sistema muestra solo los eventos de la categoría Conciertos privados

  Scenario: Filtrar eventos por una categoría sin resultados
    Given existen eventos en diferentes categorías
    And el usuario se encuentra en la pantalla de exploración de eventos
    When el usuario filtra por la categoría Afterparty
    Then el sistema muestra un mensaje de que no hay eventos disponibles en esa categoría

  Scenario: Quitar el filtro de categoría
    Given existen eventos en diferentes categorías
    And el usuario se encuentra en la pantalla de exploración de eventos
    And el usuario filtra por la categoría Conciertos privados
    When el usuario quita el filtro de categoría
    Then el sistema muestra nuevamente todos los eventos disponibles
