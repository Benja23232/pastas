'use client'

import { useState } from 'react'
import { Producto } from '@prisma/client'
import { categoriasMap } from '@/lib/utils'
import ProductCard from './ProductCard'

export default function ProductList({ productos }: { productos: Producto[] }) {
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState<string>('TODAS')
  const [soloVacios, setSoloVacios] = useState(false)

  const filtrados = productos.filter(p => {
    const coincideTexto = (p.nombre.toLowerCase() + (p.descripcion?.toLowerCase() || '')).includes(search.toLowerCase())
    const coincideCat = categoria === 'TODAS' || p.categoria === categoria
    // Cambiamos la lógica del filtro
    const coincideStock = soloVacios ? p.stock <= 0 : true
    return coincideTexto && coincideCat && coincideStock
  })

  const agrupados = filtrados.reduce((acc, p) => {
    if (!acc[p.categoria]) acc[p.categoria] = []
    acc[p.categoria].push(p)
    return acc
  }, {} as Record<string, Producto[]>)

  return (
    <section id="listv">
      <div className="card filters">
        <input 
          type="search" 
          placeholder="Buscar por nombre o descripción…" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="TODAS">Todas las categorías</option>
          {Object.entries(categoriasMap).map(([key, val]) => (
            <option key={key} value={key}>{val}</option>
          ))}
        </select>
        <label className="chk">
          <input 
            type="checkbox" 
            checked={soloVacios} 
            onChange={(e) => setSoloVacios(e.target.checked)} 
          /> 
          Solo vacíos
        </label>
      </div>

      <div id="cards">
        {Object.keys(agrupados).length === 0 ? (
          <div className="card muted">No se encontraron tuppers con estos filtros.</div>
        ) : (
          Object.entries(agrupados).map(([catKey, prods]) => (
            <div key={catKey}>
              <h2 className="cat">
                {categoriasMap[catKey as keyof typeof categoriasMap]} 
                <small>({prods.length})</small>
              </h2>
              <div className="grid">
                {prods.map(producto => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}