Feature: Crear lista de favoritos
  Como usuario registrado de Arcana
  Quiero marcar eventos como favoritos
  Para acceder rápidamente a los eventos que me interesan

  Scenario: Agregar un evento a la lista de favoritos
    Given el usuario ha iniciado sesión y no tiene favoritos
    And existe un evento disponible para marcar como favorito
    When el usuario agrega el evento a sus favoritos
    Then el evento aparece en la lista de favoritos del usuario

  Scenario: Ver la lista de favoritos vacía
    Given el usuario ha iniciado sesión y no tiene favoritos
    When el usuario consulta la sección Mis favoritos
    Then el sistema muestra un mensaje indicando que no tiene eventos favoritos

  Scenario: Quitar un evento de la lista de favoritos
    Given el usuario ha iniciado sesión y tiene un evento en su lista de favoritos
    When el usuario quita el evento de sus favoritos
    Then la lista de favoritos del usuario queda vacía
