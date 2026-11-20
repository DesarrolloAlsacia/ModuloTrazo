const express = require("express")
const cors = require("cors")
const path = require("path")

require("dotenv").config({ path: path.join(__dirname, "../.env"), quiet: true })

const loginRoutes = require("./routes/login.routes")
const impresoraRoutes = require("./routes/impresora.routes")
const controlRoutes = require("./routes/control.routes")
const app = express()
const browser = path.join(__dirname, "../../frontend/dist/browser")

app.use(cors())
app.use(express.json({ limit: "64kb" }))
app.use("/api/auth", loginRoutes)
app.use("/api/impresoras", impresoraRoutes)
app.use("/api/impresion", controlRoutes)
app.use("/api", (req, res) =>
  res
    .status(404)
    .json({ mensaje: "Esta funcionalidad todavía no está implementada" }),
)

app.get(["/", "/piloto.html"], (req, res) =>
  res.sendFile(path.join(browser, "index.html")),
)
app.use(express.static(browser))

if (require.main === module) {
  const port = Number(process.env.NEXO_PORT || process.env.PORT || 5173)
  const host = process.env.HOST || "127.0.0.1"
  const server = app.listen(port, host, () =>
    console.log(`Trazo: http://${host}:${port}`),
  )
  const cerrar = () => server.close(() => process.exit(0))
  process.on("SIGINT", cerrar)
  process.on("SIGTERM", cerrar)
  process.on("message", (mensaje) => {
    if (mensaje === "shutdown") cerrar()
  })
}

module.exports = app
