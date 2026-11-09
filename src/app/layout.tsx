import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = { title: 'Stock Fábrica de Pastas' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header>
          <h1>🍝 Stock Fábrica de Pastas</h1>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}