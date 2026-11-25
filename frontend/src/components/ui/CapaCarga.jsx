import PantallaCarga from "./PantallaCarga.jsx"

export default function CapaCarga({ listo, mensaje }) {
  if (listo) return null
  return <PantallaCarga mensaje={mensaje} />
}
