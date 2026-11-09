import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { categoriasMap, unidadesMap } from '@/lib/utils'
import { updateProducto } from '@/app/actions'
import { Categoria, Unidad } from '@prisma/client'

// Destraba la compilación asíncrona en Next.js 15
export const instant = false

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  // Esperamos la promesa de los parámetros
  const { id } = await params
  
  const producto = await prisma.producto.findUnique({
    where: { id }
  })

  if (!producto) notFound()

  // Acción de servidor integrada: procesa el formulario directamente sin componentes cliente
  async function guardarCambios(formData: FormData) {
    'use server'
    
    const data = {
      numero: Number(formData.get('numero')),
      nombre: formData.get('nombre') as string,
      categoria: formData.get('categoria') as Categoria,
      descripcion: formData.get('descripcion') as string,
      unidad: formData.get('unidad') as Unidad,
    }

    const result = await updateProducto(id, data)
    
    if (result.success) {
      redirect(`/productos/${id}`)
    } else {
      throw new Error(result.error || 'Ocurrió un error al actualizar el tupper')
    }
  }

  return (
    <section>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Editar Tupper</h2>
          <Link href={`/productos/${id}`} className="btn sec sm" style={{ textDecoration: 'none' }}>
            ← Cancelar
          </Link>
        </div>
        
        {/* Conectamos el formulario a la función asíncrona usando 'action' */}
        <form action={guardarCambios}>
          <div className="row" style={{ marginBottom: '12px' }}>
            <div>
              <label>Nº de Tupper *</label>
              <input name="numero" type="number" min="1" required defaultValue={producto.numero || ''} />
            </div>
            <div>
              <label>Contenido *</label>
              <input name="nombre" required defaultValue={producto.nombre} />
            </div>
          </div>
          
          <div className="row">
            <div>
              <label>Categoría</label>
              <select name="categoria" defaultValue={producto.categoria}>
                {Object.entries(categoriasMap).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Unidad</label>
              <select name="unidad" defaultValue={producto.unidad}>
                {Object.entries(unidadesMap).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          
          <label>Especificación / Notas</label>
          <textarea name="descripcion" rows={3} defaultValue={producto.descripcion || ''}></textarea>
          
          <div className="actions" style={{ marginTop: '20px' }}>
            <button className="btn" type="submit">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}