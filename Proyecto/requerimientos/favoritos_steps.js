const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

let usuario = {};
let eventoFavorito = null;
let mensajeFavoritos = '';

Given('el usuario ha iniciado sesión y no tiene favoritos', function () {
    usuario = { id: 1, favoritos: [] };
    mensajeFavoritos = '';
});

Given('existe un evento disponible para marcar como favorito', function () {
    eventoFavorito = { id: 10, nombre: 'Concierto Exclusivo' };
});

When('el usuario agrega el evento a sus favoritos', function () {
    if (!usuario.favoritos.find(e => e.id === eventoFavorito.id)) {
        usuario.favoritos.push(eventoFavorito);
    }
});

When('el usuario consulta la sección Mis favoritos', function () {
    if (usuario.favoritos.length === 0) {
        mensajeFavoritos = 'Todavía no tienes eventos favoritos.';
    } else {
        mensajeFavoritos = '';
    }
});

Given('el usuario ha iniciado sesión y tiene un evento en su lista de favoritos', function () {
    eventoFavorito = { id: 10, nombre: 'Concierto Exclusivo' };
    usuario = { id: 1, favoritos: [eventoFavorito] };
    mensajeFavoritos = '';
});

When('el usuario quita el evento de sus favoritos', function () {
    usuario.favoritos = usuario.favoritos.filter(
        e => e.id !== eventoFavorito.id
    );
});

Then('el evento aparece en la lista de favoritos del usuario', function () {
    const encontrado = usuario.favoritos.some(
        e => e.id === eventoFavorito.id
    );
    assert.strictEqual(encontrado, true);
});

Then('el sistema muestra un mensaje indicando que no tiene eventos favoritos', function () {
    assert.strictEqual(usuario.favoritos.length, 0);
    assert.strictEqual(mensajeFavoritos, 'Todavía no tienes eventos favoritos.');
});

Then('la lista de favoritos del usuario queda vacía', function () {
    assert.strictEqual(usuario.favoritos.length, 0);
});
