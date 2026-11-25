const { conectarDB } = require("../config/database")

async function listarApps() {
  const pool = await conectarDB()
  const resultado = await pool.request().query(
    "SELECT a.ID, a.NOMBRE, a.IDSERVER, s.SERVER " +
      "FROM TZ_APP a WITH (NOLOCK) " +
      "LEFT JOIN TZ_SERVER s WITH (NOLOCK) ON s.ID = a.IDSERVER " +
      "ORDER BY a.ID",
  )
  return (resultado.recordset || []).map((fila) => ({
    id: fila.ID ?? null,
    nombre: fila.NOMBRE ?? "",
    idServer: fila.IDSERVER ?? null,
    server: fila.SERVER ?? "",
  }))
}

async function listarTipos() {
  const pool = await conectarDB()
  const resultado = await pool
    .request()
    .query("SELECT ID, NOMBRE FROM TZ_TIPOLOG WITH (NOLOCK) ORDER BY ID")
  return (resultado.recordset || []).map((fila) => ({
    id: fila.ID ?? null,
    nombre: fila.NOMBRE ?? "",
  }))
}

module.exports = { listarApps, listarTipos }
