const { conectarDB } = require("../config/database")

const obtenerUsuario = async (usuario, passwordSHA1) => {
  try {
    const pool = await conectarDB()

    const resultado = await pool
      .request()
      .input("usuario", usuario)
      .input("passwordSHA1", passwordSHA1).query(`
                SELECT
                    U_ID_Usuario,
                    U_Nombre,
                    U_Activo,
                    U_ID_Perfil,
                    U_ID_Area,
                    U_Usuario,
                    U_Clave,
                    U_Correo,
                    U_Rut
                FROM [@ATCL_USUARIO]
                WHERE U_Usuario = @usuario and U_Clave = @passwordSHA1
                and U_ID_Area IN ('8','16','22','21')
            `)

    return resultado.recordset[0] || null
  } catch (error) {
    throw error
  }
}

module.exports = {
  obtenerUsuario,
}
