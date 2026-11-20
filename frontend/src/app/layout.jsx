import "./globals.css"
import { SesionProvider } from "../lib/sesion-context.jsx"

export const metadata = {
  title: "Trazo",
  description: "Centro de operaciones",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SesionProvider>{children}</SesionProvider>
      </body>
    </html>
  )
}
