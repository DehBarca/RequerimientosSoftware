
const { Given, When, Then } = require('@cucumber/cucumber');

Given('el usuario está en la pantalla de inicio de sesión', function () {
  return 'pending';
});

Given('el usuario recibió un código por SMS', function () {
  return 'pending';
});

When('ingresa un correo válido para recuperación', function () {
  return 'pending';
});

Then('el sistema envía un enlace de recuperación por correo', function () {
  return 'pending';
});

When('ingresa un número válido para recuperación', function () {
  return 'pending';
});

Then('el sistema envía un código por SMS', function () {
  return 'pending';
});

When('ingresa un correo no registrado', function () {
  return 'pending';
});

Then('el sistema muestra un mensaje de error', function () {
  return 'pending';
});

When('intenta usarlo después de 10 minutos', function () {
  return 'pending';
});

Then('el sistema rechaza el código y solicita generar uno nuevo', function () {
  return 'pending';
});
