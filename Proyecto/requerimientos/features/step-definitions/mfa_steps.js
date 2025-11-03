const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

let estadoUsuario = {};
let codigoIntentos = 0;

Given('el usuario ingresó su correo y contraseña válidos', function () {
    estadoUsuario = { autenticado: true, mfa: false };
});

When('el sistema solicita el código MFA', function () {
    if (estadoUsuario.autenticado) {
        estadoUsuario.mfa = true;
    }
});

Then('el usuario debe ver una pantalla para ingresar el código', function () {
    assert.strictEqual(estadoUsuario.mfa, true);
});

Given('el usuario se encuentra en la pantalla de MFA', function () {
    estadoUsuario = { bloqueado: false, intentos: 0 };
});

When('el usuario ingresa un código incorrecto tres veces', function () {
    codigoIntentos = 3;
    if (codigoIntentos >= 3) {
        estadoUsuario.bloqueado = true;
    }
});

Then('el sistema debe bloquear temporalmente su cuenta', function () {
    assert.strictEqual(estadoUsuario.bloqueado, true);
});

Given('el usuario tiene configurado MFA por correo electrónico', function () {
    estadoUsuario = { mfaMetodo: 'correo', codigoEnviado: false };
});

When('el sistema envía el código', function () {
    if (estadoUsuario.mfaMetodo === 'correo') {
        estadoUsuario.codigoEnviado = true;
    }
});

Then('el usuario debe recibirlo en su bandeja de entrada', function () {
    assert.strictEqual(estadoUsuario.codigoEnviado, true);
});
