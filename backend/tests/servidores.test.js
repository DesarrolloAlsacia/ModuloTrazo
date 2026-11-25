const test = require("node:test")
const assert = require("node:assert/strict")
const net = require("net")
const { verificarServidor } = require("../src/services/servidores.service")

test("verificarServidor distingue un servidor activo de uno caído", async () => {
  const temporal = net.createServer((socket) => socket.destroy())
  await new Promise((resolve) => temporal.listen(0, "127.0.0.1", resolve))
  const puerto = temporal.address().port

  try {
    const activo = await verificarServidor("127.0.0.1", puerto, 500)
    assert.equal(activo.estado, "online")
    assert.equal(typeof activo.latenciaMs, "number")
    assert.ok(activo.verificadoEn)
  } finally {
    await new Promise((resolve) => temporal.close(resolve))
  }

  const caido = await verificarServidor("127.0.0.1", puerto, 200)
  assert.equal(caido.estado, "offline")
  assert.equal(caido.latenciaMs, null)
})
