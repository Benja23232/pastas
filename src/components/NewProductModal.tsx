'use client'

import { useRef, useState } from 'react'
import { createProducto } from '@/app/actions'
import { Categoria, Unidad } from '@prisma/client'
import { categoriasMap, unidadesMap } from '@/lib/utils'

export default function NewProductModal() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)

  const openModal = () => dialogRef.current?.showModal()
  const closeModal = () => dialogRef.current?.close()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Acá estaba el error: ahora armamos los datos exactamente como los pide actions.ts
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
      form.reset()
      closeModal()
    } else {
      alert(result.error || 'Ocurrió un error al guardar el tupper')
    }
    
    setLoading(false)
  }

  return (
    <>
      <button onClick={openModal} className="btn">
        + Ingresar Tupper
      </button>

      <dialog ref={dialogRef} id="dp">
        <form onSubmit={handleSubmit}>
          <h2>Registrar Tupper en Heladera</h2>
          
          <div className="row" style={{ marginBottom: '12px' }}>
            <div>
              <label>Nº de Tupper *</label>
              <input name="numero" type="number" min="1" required placeholder="Ej: 15" />
            </div>
            <div>
              <label>Contenido *</label>
              <input name="nombre" required placeholder="Ej: Ravioles de ricota" />
            </div>
          </div>
          
          <div className="row">
            <div>
              <label>Categoría</label>
              <select name="categoria">
                {Object.entries(categoriasMap).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Unidad</label>
              <select name="unidad">
                {Object.entries(unidadesMap).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Cantidad</label>
              <input name="stockInicial" type="number" step="any" min="0" defaultValue="1" required />
            </div>
          </div>
          
          <label>Especificación / Notas</label>
          <textarea name="descripcion" rows={3} placeholder="Ingredientes, fecha de producción..."></textarea>
          
          <div className="actions" style={{ marginTop: '20px' }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Tupper'}
            </button>
            <button className="btn sec" type="button" onClick={closeModal} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}