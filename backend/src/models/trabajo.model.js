const sql = require("mssql")
const { conectarDB } = require("../config/database")
const { normalizarFecha } = require("./log.model")

const CONSULTA_TRABAJOS = `
  SELECT * FROM (
    SELECT CAST(f.Factura AS nvarchar(50)) AS documento,
           N'Factura' AS tipo,
           CAST(f.Status AS nvarchar(10)) AS estado,
           f.Fecha_Factura AS fecha,
           e.QtyPaginas AS paginasImpresas,
           e.MS_envioImprimir AS envioMs,
           e.MS_cola AS colaMs,
           e.MS_salidaImpresion AS impresionMs,
           e.MS_salidaPapel AS papelMs,
           e.Fecha AS estadisticaFecha
    FROM AI_Factura f WITH (NOLOCK)
    OUTER APPLY (
      SELECT TOP 1 *
      FROM AI_Estadisticas e WITH (NOLOCK)
      WHERE e.idDocumento = f.Factura AND e.idTipo = '1'
      ORDER BY e.Fecha DESC
    ) AS e
    WHERE f.IdImpresora = @codigo
      AND (f.Status IS NULL OR f.Status <> '1')
      AND f.Fecha_Factura >= CAST(@fecha AS date)
      AND f.Fecha_Factura < DATEADD(day, 1, CAST(@fecha AS date))

    UNION ALL

    SELECT CAST(g.N_Guia AS nvarchar(50)) AS documento,
           N'Guía' AS tipo,
           CAST(g.Status AS nvarchar(10)) AS estado,
           g.F_Creacion AS fecha,
           e.QtyPaginas AS paginasImpresas,
           e.MS_envioImprimir AS envioMs,
           e.MS_cola AS colaMs,
           e.MS_salidaImpresion AS impresionMs,
           e.MS_salidaPapel AS papelMs,
           e.Fecha AS estadisticaFecha
    FROM DESP_CABGUIA g WITH (NOLOCK)
    OUTER APPLY (
      SELECT TOP 1 *
      FROM AI_Estadisticas e WITH (NOLOCK)
      WHERE e.idDocumento = g.N_Guia AND e.idTipo = '2'
      ORDER BY e.Fecha DESC
    ) AS e
    WHERE g.IdImpresora = @codigo
      AND (g.Status IS NULL OR g.Status <> N'1')
      AND g.F_Creacion >= CAST(@fecha AS date)
      AND g.F_Creacion < DATEADD(day, 1, CAST(@fecha AS date))
  ) AS trabajos
  ORDER BY fecha DESC
`

function comoISO(valor) {
  if (!valor) return null
  const fecha = new Date(valor)
  return Number.isFinite(fecha.getTime()) ? fecha.toISOString() : null
}

async function listarTrabajos(codigo, fecha) {
  const pool = await conectarDB()
  const resultado = await pool
    .request()
    .input("codigo", sql.VarChar(50), String(codigo ?? "").trim())
    .input("fecha", sql.VarChar(10), normalizarFecha(fecha))
    .query(CONSULTA_TRABAJOS)

  return (resultado.recordset || []).map((fila, indice) => ({
    id: `${fila.tipo}-${fila.documento ?? indice}-${indice}`,
    documento: fila.documento ?? "",
    tipo: fila.tipo ?? "—",
    estado: fila.estado ?? "",
    paginasImpresas: fila.paginasImpresas ?? null,
    envioMs: fila.envioMs ?? null,
    colaMs: fila.colaMs ?? null,
    impresionMs: fila.impresionMs ?? null,
    papelMs: fila.papelMs ?? null,
    estadisticaFecha: comoISO(fila.estadisticaFecha),
  }))
}

module.exports = { listarTrabajos }
