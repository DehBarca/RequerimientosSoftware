Feature: Enviar Códigos a Invitados
  Como un organizador, quiero poder enviar códigos únicos a invitados seleccionados,
  para lograr un acceso exclusivo y controlado a eventos privados en Arcana.

  Background:
    Given el organizador ha creado el evento "Fiesta Exclusiva"
    And el evento "Fiesta Exclusiva" está activo
    And existe una base de datos de códigos e invitados

  # Happy Path
  Scenario: Organizador envía código único a un invitado exitosamente
    Given el organizador ha seleccionado al invitado "inv1@example.com"
    And el código "XYZ789" es generado con límite 1 uso
    And la fecha de expiración es "2025-10-25 11:59 PM CST"
    When el organizador envía el código por "correo"
    Then el código es enviado exitosamente
    And el invitado "inv1@example.com" recibe el link personalizado
    And el organizador recibe notificación "Código enviado exitosamente"
    And el código queda registrado en la base de datos

  # Envío a múltiples invitados
  Scenario: Organizador envía códigos a múltiples invitados
    Given el organizador ha seleccionado la lista de invitados:
      | email              |
      | inv1@example.com   |
      | inv2@example.com   |
      | inv3@example.com   |
    When el organizador envía códigos únicos por "correo"
    Then se generan 3 códigos únicos
    And cada invitado recibe su código personalizado
    And el organizador recibe notificación "3 códigos enviados exitosamente"

  # Fallo en la entrega
  Scenario: Fallo de entrega por correo inválido
    Given el organizador ha seleccionado al invitado "invalid-email"
    And el código "ABC123" es generado con límite 1 uso
    When el organizador intenta enviar el código por "correo"
    Then el envío falla por correo inválido
    And el organizador recibe notificación "Error: Correo inválido para invitado"
    And el código no es enviado

  # Personalización de código
  Scenario: Organizador personaliza el código con prefijo de seguridad
    Given el organizador ha seleccionado al invitado "inv1@example.com"
    And el organizador personaliza el código con prefijo "MYEVENT"
    When el sistema genera el código personalizado
    Then el código generado tiene formato "MYEVENT-XXX"
    And el código cumple con requisitos de seguridad
    And el código es enviado por "correo"

  # Regenerar código expirado
  Scenario: Organizador regenera código que expiró sin uso
    Given el invitado "inv2@example.com" tenía código "OLD789"
    And el código "OLD789" expiró sin ser usado
    When el organizador solicita regenerar el código
    Then se genera nuevo código "NEW789"
    And el nuevo código tiene nueva fecha de expiración
    And el código "NEW789" es enviado al invitado
    And el organizador recibe notificación "Código regenerado y enviado"

  # Prevención de duplicación
  Scenario: Intento de enviar código duplicado al mismo invitado
    Given el invitado "inv3@example.com" ya tiene código activo "DUP123"
    When el organizador intenta enviar otro código al mismo invitado
    Then el sistema rechaza la duplicación
    And el organizador recibe notificación "El invitado ya tiene un código activo"
    And no se genera código nuevo

  # Prevención de reventa
  Scenario: Bloqueo de múltiples envíos para prevenir reventa
    Given el invitado "inv1@example.com" recibió código "CODE456"
    When el organizador intenta enviar 3 códigos más al mismo invitado
    Then el sistema bloquea los envíos adicionales
    And el organizador recibe alerta "Posible reventa detectada"
    And solo el primer código permanece activo

  # Envío por diferentes canales
  Scenario Outline: Enviar código por diferentes canales de comunicación
    Given el organizador ha seleccionado al invitado "<invitado>"
    And el código "<codigo>" es generado
    When el organizador envía el código por "<canal>"
    Then el código es enviado a través de "<canal>"
    And el invitado recibe el link con formato "<formato>"
    And el registro muestra método de envío "<canal>"

    Examples:
      | invitado           | codigo  | canal      | formato                           |
      | inv1@example.com   | EMAIL01 | correo     | https://arcana.com/event?c=EMAIL01|
      | inv2@example.com   | PLAT02  | plataforma | Mensaje en notificaciones Arcana  |
      | inv3@example.com   | WHATS03 | WhatsApp   | WhatsApp: arcana.com/event?c=WHATS03|

  # Límites de uso personalizados
  Scenario: Crear código con límite de uso específico
    Given el organizador ha seleccionado al invitado "inv1@example.com"
    And el organizador establece límite de uso en 3
    When el sistema genera el código "MULTI123"
    Then el código "MULTI123" tiene límite de 3 usos
    And el contador de usos es 0
    And el código es enviado al invitado

  # Validación de unicidad
  Scenario: Sistema valida unicidad del código generado
    Given existen códigos en la base de datos
    When el sistema genera nuevo código para "inv2@example.com"
    Then el código generado es único en la base de datos
    And no existe colisión con códigos existentes
    And el código cumple formato establecido

  # Notificación de fallo en servicio de mensajería
  Scenario: Fallo en servicio de mensajería externa
    Given el organizador ha seleccionado al invitado "inv1@example.com"
    And el código "FAIL123" es generado
    When el servicio de "WhatsApp" no está disponible
    And el organizador intenta enviar por "WhatsApp"
    Then el sistema registra el error de envío
    And el organizador recibe notificación "Error: Servicio WhatsApp no disponible"
    And el código queda marcado como pendiente de envío

  # Validación de evento activo
  Scenario: Intento de enviar código con evento inactivo
    Given el evento "Fiesta Exclusiva" está inactivo
    When el organizador intenta enviar código al invitado "inv1@example.com"
    Then el sistema rechaza el envío
    And el organizador recibe notificación "Error: El evento no está activo"
    And no se genera código

  # Subir lista de invitados por CSV
  Scenario: Organizador carga lista de invitados desde archivo CSV
    Given el organizador tiene archivo CSV con 5 invitados
    When el organizador carga el archivo CSV
    Then el sistema valida el formato del archivo
    And se extraen 5 correos válidos
    And se generan 5 códigos únicos
    And los códigos son enviados a todos los invitados
    And el organizador recibe resumen "5/5 códigos enviados exitosamente"
