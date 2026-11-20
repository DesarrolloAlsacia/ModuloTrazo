const jwt = require('jsonwebtoken');
const loginService = require('../services/login.service');

const login = async (req, res) => {
    const { usuario, password } = req.body || {};

    if (typeof usuario !== 'string' || typeof password !== 'string' || !usuario.trim() || !password.trim()) {
        return res.status(400).json({ success: false, mensaje: 'Ingresa usuario y contraseña' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(503).json({ success: false, mensaje: 'Configura JWT_SECRET en backend/.env' });
    }

    try {
        const user = await loginService.login(usuario.trim(), password.trim());
        const usuarioSesion = {
            id: user.U_ID_Usuario,
            nombre: user.U_Nombre,
            perfil: user.U_ID_Perfil,
            area: user.U_ID_Area
        };
        const token = jwt.sign(usuarioSesion, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ success: true, token, usuario: usuarioSesion });
    } catch (error) {
        const mensaje = ['Usuario o contraseña incorrectos', 'Usuario inactivo, contactar a informática'].includes(error.message)
            ? error.message
            : 'No se pudo validar el acceso. Revisa la conexión SQL de backend/.env';
        res.status(401).json({ success: false, mensaje });
    }
};

module.exports = { login };
