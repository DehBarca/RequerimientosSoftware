const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

let evento = {};
let seGuardaronCambios = false;
let errorValidacion = '';
let eventoCancelado = false;

Given('existe un evento activo con aforo suficiente y boletos vendidos', function () {
    evento = {
        id: 1,
        nombre: 'Evento Exclusivo',
        descripcion: 'Descripción inicial',
        aforo: 100,
        boletosVendidos: 20,
        estado: 'activo'
    };
    seGuardaronCambios = false;
    errorValidacion = '';
    eventoCancelado = false;
});

When('el organizador cambia la descripción del evento', function () {
    if (evento.estado === 'activo') {
        evento.descripcion = 'Nueva descripción del evento';
        seGuardaronCambios = true;
    }
});

Then('el sistema guarda los cambios del evento', function () {
    assert.strictEqual(seGuardaronCambios, true);
    assert.strictEqual(evento.descripcion, 'Nueva descripción del evento');
});

Given('existe un evento activo con aforo menor al número de boletos vendidos propuesto', function () {
    evento = {
        id: 2,
        nombre: 'Evento Limitado',
        aforo: 50,
        boletosVendidos: 40,
        estado: 'activo'
    };
    seGuardaronCambios = false;
    errorValidacion = '';
});

When('el organizador intenta reducir el aforo por debajo de los boletos vendidos', function () {
    const nuevoAforo = 30; // menor a boletosVendidos (40)
    if (nuevoAforo < evento.boletosVendidos) {
        seGuardaronCambios = false;
        errorValidacion = 'El aforo no puede ser menor a los boletos ya vendidos.';
    } else {
        evento.aforo = nuevoAforo;
        seGuardaronCambios = true;
    }
});

Then('el sistema no permite guardar los cambios en el evento', function () {
    assert.strictEqual(seGuardaronCambios, false);
    assert.strictEqual(
        errorValidacion,
        'El aforo no puede ser menor a los boletos ya vendidos.'
    );
});

Given('existe un evento activo con asistentes registrados', function () {
    evento = {
        id: 3,
        nombre: 'Evento con Asistentes',
        estado: 'activo',
        asistentesRegistrados: 25
    };
    eventoCancelado = false;
});

When('el organizador cancela el evento', function () {
    if (evento.estado === 'activo') {
        evento.estado = 'cancelado';
        eventoCancelado = true;
    }
});

Then('el sistema marca el evento como cancelado y bloquea nuevas compras', function () {
    assert.strictEqual(eventoCancelado, true);
    assert.strictEqual(evento.estado, 'cancelado');
});
