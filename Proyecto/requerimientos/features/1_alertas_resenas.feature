Feature: Gestión de alertas por reseñas negativas
  Como organizador de eventos
  Quiero recibir alertas cuando haya reseñas negativas que cumplan ciertos umbrales
  Para poder reaccionar y priorizar incidencias

  @reseñas @alertas
  Scenario: The One Where Ana Leaves The First Negative Review
    Given el evento "After Party Exclusivo" tiene 12 reseñas de 5★
    And el asistente "Ana López" (user123) confirmó asistencia
    When Ana deja una reseña de 2★ con comentario "El sonido fue muy bajo" a las 02:15 AM del 15/11/2025
    Then se genera alerta normal al organizador "Luis García" con título "Primera reseña negativa en After Party Exclusivo"
    And recibe push y email con enlace directo a la reseña
    And aparece en su dashboard con badge rojo

  @umbral @critico
  Scenario: The One With Three Negative Reviews
    Given el evento "Cena Privada" ya tiene 2 reseñas de 1★ y 10 de 5★
    When el asistente "Carlos Ruiz" deja reseña de 1★ a las 11:40 PM
    Then se dispara alerta crítica "¡Alerta crítica! 3 reseñas negativas en Cena Privada"
    And el nivel de prioridad es rojo y aparece en la parte superior del dashboard

  @umbral @porcentaje
  Scenario: The One Where The 20% Threshold Is Exceeded
    Given el evento "Lanzamiento Marca X" tiene 9 reseñas: 7 de 5★ y 2 de 1★ (22.2%)
    When se guarda la reseña nº9 (1★)
    Then se genera alerta crítica inmediatamente por superar el 20% de reseñas negativas

  @excepcion @duplicada
  Scenario: The One Where María Updates Her Review
    Given el asistente "María Torres" ya dejó reseña de 4★ el día anterior
    When intenta dejar otra reseña de 1★
    Then el sistema actualiza la reseña anterior (no crea nueva)
    And si la nueva calificación es ≤2★ y la anterior era >2★ entonces genera alerta normal
    And si ambas son ≤2★ entonces no genera nueva alerta

  @excepcion @notificaciones
  Scenario: The One Where The Notification Service Fails
    Given se genera una alerta crítica
    But el servicio de push/email falla
    Then la alerta queda en estado "pendiente de envío" en el dashboard
    And el sistema reintenta cada 15 minutos (máx. 3 veces)
    And después de 3 fallos marca la alerta como "error de entrega" y registra log

  @excepcion @seguridad
  Scenario: The One Where The Unauthorized User Tries To Review
    Given el usuario "Intruso99" no asistió al evento
    When intenta enviar reseña de 1★
    Then el sistema rechaza la reseña con mensaje "Solo asistentes confirmados pueden valorar"
    And registra intento sospechoso en log de seguridad

  @borde @porcentaje
  Scenario: The One With Few Reviews And High Percentage
    Given el evento "Reunión VIP" tiene 4 reseñas: 3 de 5★ y 1 de 1★
    When llega la 5ª reseña de 2★
    Then se dispara alerta crítica (2 de 5 = 40% > 20%)

  @borde @resuelta
  Scenario: The One Where The Organizer Resolves The Alert
    Given existe alerta crítica en dashboard
    When el organizador pulsa "Marcar como resuelta" y escribe "Se contactó al asistente y se ofreció reembolso"
    Then la alerta desaparece de la lista de pendientes
    And queda en histórico con estado "resuelta" y comentario
