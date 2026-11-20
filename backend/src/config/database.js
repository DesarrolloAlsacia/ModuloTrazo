const sql = require("mssql")

let pool

const conectarDB = async () => {
  if (pool) return pool
  const server = process.env.DB_SERVER || process.env.DB1_HOST
  const database = process.env.DB_DATABASE || process.env.DB1_DATABASE
  const user = process.env.DB_USER || process.env.DB1_USER
  const password = process.env.DB_PASSWORD || process.env.DB1_PASSWORD
  if (!server || !database || !user || !password) {
    throw new Error("Completa la conexión SQL en backend/.env")
  }

  pool = await new sql.ConnectionPool({
    user,
    password,
    server,
    database,
    port: Number(process.env.DB_PORT || 1433),
    connectionTimeout: 8000,
    options: {
      encrypt: process.env.DB_ENCRYPT !== "false",
      serverName: process.env.DB_TLS_SERVER_NAME || undefined,
      trustServerCertificate:
        process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    },
  }).connect()

  return pool
}

module.exports = { conectarDB }
