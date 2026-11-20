const { conectarDB } = require("../config/database")
const { createDecipheriv, scrypt } = require("node:crypto")
const { isIP } = require("node:net")
const { promisify } = require("node:util")

const derivarClave = promisify(scrypt)

async function descifrarIP(valor) {
  const clave = process.env.IMPRESORA_AES_KEY
  if (!clave || !valor) return null

  const datos = Buffer.from(valor.trim(), "base64")
  if (datos.length <= 44) return null

  try {
    const llave = await derivarClave(clave, datos.subarray(0, 16), 32)
    const descifrador = createDecipheriv(
      "aes-256-gcm",
      llave,
      datos.subarray(16, 28),
    )
    descifrador.setAuthTag(datos.subarray(28, 44))
    const ip = Buffer.concat([
      descifrador.update(datos.subarray(44)),
      descifrador.final(),
    ]).toString("utf8")
    return isIP(ip) ? ip : null
  } catch {
    return null
  }
}

async function listarImpresoras() {
  const db = await conectarDB()
  const { recordset } = await db.request().query(`
        SELECT [Code], [IP], [Modelo], [IdCHK]
        FROM [AI_Impresora]
    `)
  const orden = new Intl.Collator("es", { numeric: true })
  recordset.sort(
    (a, b) =>
      orden.compare(a.IdCHK ?? "", b.IdCHK ?? "") ||
      orden.compare(a.Code, b.Code),
  )
  const impresoras = await Promise.all(
    recordset.slice(0, 100).map(async (fila) => ({
      ...fila,
      IP: await descifrarIP(fila.IP),
    })),
  )
  return { impresoras }
}

module.exports = { listarImpresoras }
