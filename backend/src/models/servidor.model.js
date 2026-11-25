const { conectarDB } = require("../config/database")

async function listarServidores() {
  const pool = await conectarDB()
  const resultado = await pool.request().query(
    "SELECT ID, SERVER FROM TZ_SERVER WITH (NOLOCK) " +
      "WHERE UPPER(LTRIM(RTRIM(SERVER))) <> 'LOCAL' " +
      "ORDER BY ID",
  )
  return (resultado.recordset || []).map((fila) => ({
    id: fila.ID ?? null,
    nombre: fila.SERVER ?? "",
  }))
}

module.exports = { listarServidores }
