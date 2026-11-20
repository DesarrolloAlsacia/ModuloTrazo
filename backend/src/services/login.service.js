const usuarioModel = require('../models/usuario.model');
const SHA1 = require('crypto-js/sha1');

const login = async (usuario, password) => {
    const passwordSHA1 = SHA1(password).toString();
    const user = await usuarioModel.obtenerUsuario(
        usuario,
        passwordSHA1
    );

    if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
    }

    if (user.U_Activo !== 'Y') {
        throw new Error('Usuario inactivo, contactar a informática');
    }

    return user;
};

module.exports = {
    login
};
