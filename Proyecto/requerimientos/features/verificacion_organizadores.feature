
Feature: Verificación de organizadores
  Como organizador quiero validar mi identidad con documento oficial para generar confianza en mis eventos.

  Scenario: The One Where Ross Gets Verified
    Given el organizador tiene una cuenta activa
    And accede a su perfil
    When sube un documento oficial válido
    Then el sistema valida el documento
    And muestra un distintivo visual en el perfil

  Scenario: The One Where Joey Uploads a Blurry Document
    Given el organizador accede a su perfil
    When sube un documento ilegible
    Then el sistema rechaza la verificación
    And solicita un nuevo documento

  Scenario: The One Where Chandler Tries a Fake ID
    Given el organizador accede a su perfil
    When sube un documento falso
    Then el sistema rechaza la verificación
    And notifica al organizador
