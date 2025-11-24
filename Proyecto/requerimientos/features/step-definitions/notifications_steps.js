const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

let notificacion = {};
let permisos = true;
let registro = [];

Given('el organizador ha creado y activado un evento', function () {
    notificacion = { evento: true, enviada: false, mensaje: '' };
});

Given('el usuario ha otorgado permiso para recibir notificaciones', function () {
    permisos = true;
});

When('el organizador confirma el evento', function () {
    if (permisos && notificacion.evento) {
        notificacion.enviada = true;
        notificacion.mensaje = "Evento confirmado";
    }
});

Then('el usuario debe recibir una notificación inmediata con el mensaje {string}', function (mensajeEsperado) {
    assert.strictEqual(notificacion.mensaje, mensajeEsperado);
});

Given('el usuario rechaza los permisos de notificación', function () {
    permisos = false;
});

When('el sistema intenta enviar una alerta', function () {
    if (!permisos) {
        notificacion.mensaje = "No se pueden recibir notificaciones";
    }
});

Then('se debe mostrar un aviso que diga {string}', function (mensajeEsperado) {
    assert.strictEqual(notificacion.mensaje, mensajeEsperado);
});

Given('el usuario recibe una notificación de evento', function () {
    notificacion = { evento: true, clic: false, redirigido: false };
});

When('el usuario hace clic en la notificación', function () {
    notificacion.clic = true;
    if (notificacion.clic) notificacion.redirigido = true;
});

Then('el sistema debe dirigirlo a la página del evento correspondiente', function () {
    assert.strictEqual(notificacion.redirigido, true);
});

Given('el sistema envía una notificación sobre un evento', function () {
    notificacion = { enviada: true, estado: 'enviada' };
});

When('el usuario abre la notificación', function () {
    if (notificacion.enviada) {
        notificacion.estado = 'leída';
        notificacion.fecha = new Date().toISOString();
        registro.push(notificacion);
    }
});

Then('el sistema debe registrar el estado como {string} con la fecha y hora', function (estadoEsperado) {
    const ultima = registro[registro.length - 1];
    assert.strictEqual(ultima.estado, estadoEsperado);
    assert.ok(ultima.fecha);
});
