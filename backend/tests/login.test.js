const test = require('node:test');
const assert = require('node:assert/strict');
const SHA1 = require('crypto-js/sha1');
const jwt = require('jsonwebtoken');
const model = require('../src/models/usuario.model');
const app = require('../src/app');

test('Login de RRHH, token y ausencia de operaciones de interfaces', async () => {
    const anterior = model.obtenerUsuario;
    const secretoAnterior = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'secreto-aislado-solo-para-esta-prueba';
    model.obtenerUsuario = async (usuario, clave) => {
        if (usuario !== 'prueba' || clave !== SHA1('prueba-local').toString()) return null;
        return { U_ID_Usuario: 1, U_Nombre: 'Usuario de prueba', U_ID_Perfil: '1', U_ID_Area: '8', U_Activo: 'Y', U_Clave: 'NO_MOSTRAR' };
    };
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    const login = datos => fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
    try {
        assert.equal((await login({})).status, 400);
        assert.equal((await login({ usuario: 'prueba', password: 'incorrecta' })).status, 401);
        const respuesta = await login({ usuario: 'prueba', password: 'prueba-local' });
        assert.equal(respuesta.status, 200);
        const data = await respuesta.json();
        assert.ok(data.success);assert.equal(data.usuario.nombre, 'Usuario de prueba');assert.ok(!JSON.stringify(data).includes('NO_MOSTRAR'));
        const payload = jwt.verify(data.token, process.env.JWT_SECRET);assert.equal(payload.exp - payload.iat, 8 * 60 * 60);
        assert.equal((await fetch(base + '/api/auth/me')).status, 401);
        assert.equal((await fetch(base + '/api/auth/me', { headers: { Authorization: 'Bearer ' + data.token } })).status, 200);
        const vencido = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: -1 });
        assert.equal((await fetch(base + '/api/auth/me', { headers: { Authorization: 'Bearer ' + vencido } })).status, 401);
        for (const ruta of ['apps', 'apps/prueba/versions', 'apps/prueba/deploy', 'apps/prueba/run', 'apps/prueba/schedule']) {
            assert.equal((await fetch(base + '/api/' + ruta, { method: 'POST', headers: { Authorization: 'Bearer ' + data.token } })).status, 404);
        }
        model.obtenerUsuario = async () => ({ U_Activo: 'N' });
        const inactivo = await login({ usuario: 'prueba', password: 'prueba-local' });assert.equal(inactivo.status, 401);assert.match((await inactivo.json()).mensaje, /inactivo/);
        delete process.env.JWT_SECRET;
        assert.equal((await login({ usuario: 'prueba', password: 'prueba-local' })).status, 503);
    } finally {
        model.obtenerUsuario = anterior;
        if (secretoAnterior === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = secretoAnterior;
        server.closeAllConnections();await new Promise(resolve => server.close(resolve));
    }
});
