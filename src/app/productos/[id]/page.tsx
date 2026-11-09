import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categoriasMap, unidadesMap, tipoMovimientoMap } from '@/lib/utils'
import MovementClientForm from './MovementClientForm'

export const instant = false

async function ProductoData({ id }: { id: string }) {
  const producto = await prisma.producto.findUnique({
    where: { id },
    include: { movimientos: { orderBy: { fecha: 'desc' }, take: 100 } }
  })

  if (!producto) notFound()

  const estaVacio = producto.stock <= 0
  const stockFmt = Math.round(producto.stock * 100) / 100

  return (
    <div className="detalle-layout">
      {/* Columna Izquierda: Información y Formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem' }}>
                {producto.numero && <span style={{ color: 'var(--brand)', marginRight: '8px' }}>#{producto.numero}</span>}
                {producto.nombre}
              </h2>
              <div className="muted">{categoriasMap[producto.categoria]}</div>
            </div>
            <div className="actions" style={{ alignSelf: 'flex-start' }}>
              <Link href="/" className="btn sec sm" style={{ textDecoration: 'none' }}>← Volver</Link>
            </div>
          </div>
          
          {producto.descripcion && <p style={{ whiteSpace: 'pre-wrap', marginTop: '12px' }}>{producto.descripcion}</p>}
          
          <p style={{ marginTop: '16px', marginBottom: 0 }}>
            <b style={{ fontSize: '1.6rem' }}>{stockFmt} {unidadesMap[producto.unidad]}</b> 
            {estaVacio ? <span className="badge low">Vacío</span> : <span className="badge ok">En heladera</span>}
          </p>
        </div>

        <MovementClientForm productoId={producto.id} unidad={unidadesMap[producto.unidad]} />
      </div>

      {/* Columna Derecha: Tabla de Historial (Con Scroll horizontal en celular) */}
      <div className="card table-wrap" style={{ marginBottom: 0 }}>
        <h2 style={{ margin: '0 0 16px 0' }}>Historial</h2>
        {producto.movimientos.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Stock</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {producto.movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(mov.fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td className={mov.tipo.toLowerCase()}>{tipoMovimientoMap[mov.tipo]}</td>
                  <td>{Math.round(mov.cantidad * 100) / 100}</td>
                  <td style={{ fontWeight: 'bold' }}>{Math.round(mov.stockResultante * 100) / 100}</td>
                  <td>{mov.nota || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Sin movimientos todavía.</p>
        )}
      </div>
    </div>
  )
}

export default async function ProductoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <section>
      <Suspense fallback={<div className="card muted" style={{ textAlign: 'center' }}>Cargando tupper...</div>}>
        <ProductoData id={id} />
      </Suspense>
    </section>
  )
}