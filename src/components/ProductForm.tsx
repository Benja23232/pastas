'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProducto, updateProducto, deleteProducto } from '@/app/actions'
import { Categoria, Unidad, Producto } from '@prisma/client'
import { categoriasMap, unidadesMap } from '@/lib/utils'

export default function ProductForm({ producto }: { producto?: Producto }) {
  const router = useRouter()
  const isEditing = !!producto
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    // Separamos la lógica porque editar no necesita stockInicial, pero crear sí.
    if (isEditing) {
      const data = {
        numero: Number(formData.get('numero')),
        nombre: formData.get('nombre') as string,
        categoria: formData.get('categoria') as Categoria,
        descripcion: formData.get('descripcion') as string,
        unidad: formData.get('unidad') as Unidad,
      }
      
      const result = await updateProducto(producto.id, data)
      if (result.success) {
        router.push(`/productos/${producto.id}`)
      } else {
        setError(result.error || 'Error al actualizar el tupper')
        setLoading(false)
      }
    } else {
      const data = {
        numero: Number(formData.get('numero')),
        nombre: formData.get('nombre') as string,
        categoria: formData.get('categoria') as Categoria,
        descripcion: formData.get('descripcion') as string,
        unidad: formData.get('unidad') as Unidad,
        stockInicial: Number(formData.get('stockInicial') || 1),
      }
      
      const result = await createProducto(data)
      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Error al crear el tupper')
        setLoading(false)
      }
    }
  }

  const handleDelete = async () => {
    if (!producto || !confirm('¿Estás seguro de eliminar este tupper? Esto borrará también todo su historial de movimientos.')) return
    
    setLoading(true)
    const result = await deleteProducto(producto.id)
    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Error al eliminar')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      {error && <div style={{ color: 'var(--red)', marginBottom: '14px', fontWeight: 'bold' }}>{error}</div>}
      
      <div className="row">
        <div>
          <label>Nº de Tupper *</label>
          <input type="number" min="1" required name="numero" defaultValue={producto?.numero || ''} />
        </div>
        <div>
          <label>Contenido *</label>
          <input required name="nombre" defaultValue={producto?.nombre} />
        </div>
      </div>

      <div className="row">
        <div>
          <label>Categoría</label>
          <select name="categoria" defaultValue={producto?.categoria || 'PASTA_FRESCA'}>
            {Object.entries(categoriasMap).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Unidad de medida</label>
          <select name="unidad" defaultValue={producto?.unidad || 'KG'}>
            {Object.entries(unidadesMap).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        
        {/* Solo mostramos el stock inicial si estamos creando un tupper nuevo */}
        {!isEditing && (
          <div>
            <label>Cantidad Inicial</label>
            <input type="number" step="any" min="0" name="stockInicial" defaultValue={1} />
          </div>
        )}
      </div>

      <label>Descripción y notas</label>
      <textarea name="descripcion" rows={3} defaultValue={producto?.descripcion || ''} />

      <div className="actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Guardando...' : 'Guardar Tupper'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn sec">
            Cancelar
          </button>
        </div>
        
        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={loading} className="btn danger">
            Eliminar
          </button>
        )}
      </div>
    </form>
  )
}