const sql = require("mssql")
const { conectarDB } = require("../config/database")

const CONSULTA_LOGS =
  "SELECT *, CONVERT(varchar(19), Fecha, 120) AS FechaTexto FROM tz_log WITH (NOLOCK) " +
  "WHERE Fecha >= CAST(@fecha AS date) " +
  "AND Fecha < DATEADD(day, 1, CAST(@fecha AS date)) " +
  "ORDER BY ID DESC"

function hoy() {
  const ahora = new Date()
  const anio = ahora.getFullYear()
  const mes = String(ahora.getMonth() + 1).padStart(2, "0")
  const dia = String(ahora.getDate()).padStart(2, "0")
  return `${anio}-${mes}-${dia}`
}

function normalizarFecha(valor) {
  const texto = String(valor ?? "")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return hoy()
  const fecha = new Date(texto + "T00:00:00")
  return Number.isFinite(fecha.getTime()) ? texto : hoy()
}

function comoTexto(valor) {
  if (valor == null) return ""
  if (typeof valor === "string") return valor
  if (Buffer.isBuffer(valor)) return valor.toString("utf8")
  return String(valor)
}

function fechaComoTexto(texto, valor) {
  const directo = comoTexto(texto)
  if (directo) return directo
  if (!valor) return ""

  if (valor instanceof Date && Number.isFinite(valor.getTime())) {
    const dos = (numero) => String(numero).padStart(2, "0")
    return (
      `${valor.getFullYear()}-${dos(valor.getMonth() + 1)}-${dos(valor.getDate())} ` +
      `${dos(valor.getHours())}:${dos(valor.getMinutes())}:${dos(valor.getSeconds())}`
    )
  }

  return comoTexto(valor)
}

function limpiarCuerpo(valor) {
  const texto = comoTexto(valor)
  if (!/^\s*\d{4}-\d{2}-\d{2}/.test(texto)) return texto
  const ultimoCorchete = texto.lastIndexOf("]")
  return ultimoCorchete === -1
    ? texto
    : texto.slice(ultimoCorchete + 1).trim()
}

async function listarLogs(fecha) {
  const pool = await conectarDB()
  const resultado = await pool
    .request()
    .input("fecha", sql.VarChar(10), normalizarFecha(fecha))
    .query(CONSULTA_LOGS)
  return (resultado.recordset || []).map((fila) => ({
    id: fila.ID ?? fila.id ?? null,
    cuerpo: limpiarCuerpo(fila.CUERPO ?? fila.cuerpo),
    idTipo: fila.IDTIPO ?? fila.idTipo ?? null,
    idApp: fila.IDAPP ?? fila.idApp ?? null,
    fecha: fechaComoTexto(fila.FechaTexto, fila.Fecha ?? fila.fecha),
  }))
}

module.exports = { CONSULTA_LOGS, listarLogs, normalizarFecha, hoy }
