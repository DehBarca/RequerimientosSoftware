
Feature: Edición de perfil

  Como usuario registrado,
  Quiero poder modificar mi nombre, foto y contraseña desde la app o web,
  Para mantener mi información actualizada.

  Example: Actualizar nombre y foto
    Given el usuario está autenticado y accede a su perfil
    When modifica su nombre y sube una foto válida
    Then el sistema guarda los cambios y muestra confirmación

  Example: Foto demasiado grande
    Given el usuario está autenticado y accede a su perfil
    When intenta subir una foto mayor a 5 MB
    Then el sistema rechaza la imagen y muestra un mensaje de error

  Example: Cambio de contraseña válido
    Given el usuario está autenticado y accede a su perfil
    When cambia su contraseña cumpliendo los requisitos
    Then el sistema actualiza la contraseña y muestra confirmación

  Example: Contraseña sin número
    Given el usuario está autenticado y accede a su perfil
    When cambia su contraseña sin incluir un número
    Then el sistema rechaza la actualización y muestra los requisitos
