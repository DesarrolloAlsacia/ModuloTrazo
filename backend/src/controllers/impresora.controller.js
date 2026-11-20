const { listarImpresoras } = require('../models/impresora.model');

async function listar(req, res) {
    try {
        res.json(await listarImpresoras());
    } catch {
        res.status(503).json({ mensaje: 'No se pudo consultar AI_Impresora. Revisa la conexión y los permisos de SQL Server.' });
    }
}

async function asistente(ruta = '', opciones = {}) {
    const base = process.env.IMPRESION_API_URL || 'http://172.16.21.150:3000';
    const respuesta = await fetch(base.replace(/\/$/, '') + '/api/impresoras' + ruta, {
        ...opciones,
        signal: AbortSignal.timeout(5000)
    });
    if (!respuesta.ok) throw new Error('El asistente rechazó la solicitud');
    return respuesta.json();
}

async function listarEstados(req, res) {
    try {
        const { impresoras } = await asistente();
        res.json({ impresoras: impresoras.map(({code, activa, pendientes}) => ({code, activa, pendientes})) });
    } catch {
        res.status(502).json({ mensaje: 'No se pudo consultar el estado en el asistente de impresión.' });
    }
}

async function cambiarEstado(req, res) {
    const { activa } = req.body || {};
    if (typeof activa !== 'boolean') {
        return res.status(400).json({ mensaje: 'Indica si la impresora debe quedar activa o inactiva.' });
    }

    try {
        const { impresora } = await asistente('/' + encodeURIComponent(req.params.code), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activa })
        });
        if (typeof impresora?.activa !== 'boolean') throw new Error('Estado sin confirmar');
        res.json({ activa: impresora.activa });
    } catch {
        res.status(502).json({ mensaje: 'El asistente no confirmó el cambio. Recarga para comprobar el estado.' });
    }
}

module.exports = { listar, listarEstados, cambiarEstado };
