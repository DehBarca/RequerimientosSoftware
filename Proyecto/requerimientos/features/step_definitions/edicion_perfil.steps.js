
const { Given, When, Then } = require('@cucumber/cucumber');

Given('el usuario está autenticado y accede a su perfil', function () {
  return 'pending';
});

When('modifica su nombre y sube una foto válida', function () {
  return 'pending';
});

Then('el sistema guarda los cambios y muestra confirmación', function () {
  return 'pending';
});

When('intenta subir una foto mayor a 5 MB', function () {
  return 'pending';
});

Then('el sistema rechaza la imagen y muestra un mensaje de error', function () {
  return 'pending';
});

When('cambia su contraseña cumpliendo los requisitos', function () {
  return 'pending';
});

Then('el sistema actualiza la contraseña y muestra confirmación', function () {
  return 'pending';
});

When('cambia su contraseña sin incluir un número', function () {
  return 'pending';
});

Then('el sistema rechaza la actualización y muestra los requisitos', function () {
  return 'pending';
});
