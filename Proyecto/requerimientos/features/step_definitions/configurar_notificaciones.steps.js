const { Given, When, Then } = require('@cucumber/cucumber');

Given('el usuario está autenticado y accede a la sección de notificaciones', function () {
  return 'pending';
});

Given('el usuario está autenticado y tiene eventos marcados como favoritos', function () {
  return 'pending';
});

When('desactiva SMS y push, dejando activo únicamente el correo electrónico', function () {
  return 'pending';
});

Then('solo se envían notificaciones por correo electrónico', function () {
  return 'pending';
});

When('selecciona SMS para alertas críticas y desactiva las demás', function () {
  return 'pending';
});

Then('las alertas de boletos agotados se envían solo por SMS', function () {
  return 'pending';
});

When('activa notificaciones push solo para eventos favoritos', function () {
  return 'pending';
});

Then('recibe notificaciones push únicamente cuando hay actualizaciones en sus eventos favoritos', function () {
  return 'pending';
});

When('desactiva todos los tipos de notificación excepto la confirmación de compra por correo', function () {
  return 'pending';
});

Then('solo recibe correos electrónicos de confirmación de compra', function () {
  return 'pending';
});

When('activa correo, SMS y push para todos los tipos de alerta', function () {
  return 'pending';
});

Then('recibe todas las notificaciones en los tres canales configurados', function () {
  return 'pending';
});

When('activa correo y SMS únicamente para alertas de seguridad', function () {
  return 'pending';
});

Then('solo recibe notificaciones de seguridad por correo y SMS', function () {
  return 'pending';
});