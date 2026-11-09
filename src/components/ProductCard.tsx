import { Producto } from '@prisma/client'
import { unidadesMap } from '@/lib/utils'
import Link from 'next/link'

export default function ProductCard({ producto }: { producto: Producto }) {
  const stockFmt = Math.round(producto.stock * 100) / 100
  const estaVacio = producto.stock <= 0

  return (
    <article className={`pcard ${estaVacio ? 'lowc' : ''}`}>
      <h3>
        {producto.numero && <span style={{ color: 'var(--brand)', marginRight: '6px' }}>#{producto.numero}</span>}
        {producto.nombre}
      </h3>
      <div className="d">{producto.descripcion || 'Sin descripción.'}</div>
      
      <div className="pie">
        <span className="st">
          {stockFmt} <small className="muted">{unidadesMap[producto.unidad]}</small>
        </span>
        {estaVacio ? <span className="badge low">Vacío</span> : <span className="badge ok">En heladera</span>}
      </div>
      
      <div className="actions" style={{ marginTop: '12px' }}>
        <Link href={`/productos/${producto.id}`} className="btn sm" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
          Registrar Movimiento
        </Link>
        <Link href={`/productos/${producto.id}/editar`} className="btn sec sm" style={{ textDecoration: 'none', textAlign: 'center' }}>
          Editar
        </Link>
      </div>
    </article>
  )
}