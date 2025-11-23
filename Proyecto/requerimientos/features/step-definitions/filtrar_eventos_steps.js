const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

let eventos = [];
let eventosVisibles = [];
let mensajeFiltro = '';

Given('existen eventos en diferentes categorías', function () {
    eventos = [
        { id: 1, nombre: 'Concierto A', categoria: 'Conciertos privados' },
        { id: 2, nombre: 'Evento VIP B', categoria: 'Eventos VIP' },
        { id: 3, nombre: 'Concierto C', categoria: 'Conciertos privados' }
    ];
    eventosVisibles = [];
    mensajeFiltro = '';
});

Given('el usuario se encuentra en la pantalla de exploración de eventos', function () {
    // Por defecto ve todos los eventos
    eventosVisibles = eventos.slice();
    mensajeFiltro = '';
});

When('el usuario filtra por la categoría Conciertos privados', function () {
    eventosVisibles = eventos.filter(e => e.categoria === 'Conciertos privados');
    if (eventosVisibles.length === 0) {
        mensajeFiltro = 'No hay eventos disponibles en esta categoría por el momento.';
    }
});

When('el usuario filtra por la categoría Afterparty', function () {
    eventosVisibles = eventos.filter(e => e.categoria === 'Afterparty');
    if (eventosVisibles.length === 0) {
        mensajeFiltro = 'No hay eventos disponibles en esta categoría por el momento.';
    }
});

When('el usuario quita el filtro de categoría', function () {
    eventosVisibles = eventos.slice();
    mensajeFiltro = '';
});

Then('el sistema muestra solo los eventos de la categoría Conciertos privados', function () {
    assert.ok(eventosVisibles.length > 0);
    const soloConciertos = eventosVisibles.every(
        e => e.categoria === 'Conciertos privados'
    );
    assert.strictEqual(soloConciertos, true);
});

Then('el sistema muestra un mensaje de que no hay eventos disponibles en esa categoría', function () {
    assert.strictEqual(eventosVisibles.length, 0);
    assert.strictEqual(
        mensajeFiltro,
        'No hay eventos disponibles en esta categoría por el momento.'
    );
});

Then('el sistema muestra nuevamente todos los eventos disponibles', function () {
    assert.strictEqual(eventosVisibles.length, eventos.length);
});
