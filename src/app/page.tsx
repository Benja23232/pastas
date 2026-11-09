import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ProductList from '@/components/ProductList'
import NewProductModal from '@/components/NewProductModal'

export const instant = false

async function DashboardData() {
  const productos = await prisma.producto.findMany({ orderBy: { nombre: 'asc' } })
  const totalProductos = productos.length
  // Cambiamos la lógica: ahora cuenta cuántos tuppers están vacíos (stock <= 0)
  const tuppersVacios = productos.filter(p => p.stock <= 0).length

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <NewProductModal />
      </div>

      <div className="stats" id="stats">
        <div className="stat"><b>{totalProductos}</b>Tuppers registrados</div>
        <div className="stat"><b style={{ color: 'var(--red)' }}>{tuppersVacios}</b>Tuppers vacíos</div>
      </div>
      
      <ProductList productos={productos} />
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="card muted" style={{ textAlign: 'center' }}>Cargando inventario...</div>}>
      <DashboardData />
    </Suspense>
  )
}