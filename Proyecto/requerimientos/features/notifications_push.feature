Feature: Notificaciones Push en Tiempo Real
  Como usuario o administrador
  Quiero recibir notificaciones en tiempo real
  Para mantenerme informado sobre eventos y mensajes sin necesidad de recargar la página

  Scenario: El usuario recibe una notificación inmediata al confirmar un evento
    Given el organizador ha creado y activado un evento
    And el usuario ha otorgado permiso para recibir notificaciones
    When el organizador confirma el evento
    Then el usuario debe recibir una notificación inmediata con el mensaje "Evento confirmado"

  Scenario: El usuario rechaza los permisos de notificación
    Given el usuario rechaza los permisos de notificación
    When el sistema intenta enviar una alerta
    Then se debe mostrar un aviso que diga "No se pueden recibir notificaciones"

  Scenario: El usuario hace clic en una notificación
    Given el usuario recibe una notificación de evento
    When el usuario hace clic en la notificación
    Then el sistema debe dirigirlo a la página del evento correspondiente

  Scenario: El sistema registra el envío y lectura de la notificación
    Given el sistema envía una notificación sobre un evento
    When el usuario abre la notificación
    Then el sistema debe registrar el estado como "leída" con la fecha y hora
