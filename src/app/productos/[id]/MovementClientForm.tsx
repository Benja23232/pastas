'use client'

import { useState } from 'react'
import { createMovimiento } from '@/app/actions'
import { TipoMovimiento } from '@prisma/client'

export default function MovementClientForm({ productoId, unidad }: { productoId: string, unidad: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tipo, setTipo] = useState<TipoMovimiento>(TipoMovimiento.SALIDA)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)
    const cantidad = Number(formData.get('cantidad'))
    const nota = formData.get('nota') as string

    const result = await createMovimiento(productoId, tipo, cantidad, nota)

    if (result.success) {
      form.reset()
    } else {
      setError(result.error || 'Ocurrió un error al guardar')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 0 }}>
      <h2 style={{ marginBottom: '16px' }}>Registrar Movimiento</h2>
      
      {error && <div style={{ color: 'var(--red)', fontWeight: 'bold', marginBottom: '12px' }}>{error}</div>}

      {/* Contenedor del Tipo de Operación */}
      <div style={{ marginBottom: '16px' }}>
        <label>Tipo de Operación</label>
        <div className="actions" style={{ marginTop: '6px' }}>
          <button 
            type="button" 
            onClick={() => setTipo(TipoMovimiento.ENTRADA)} 
            className={`btn sm ${tipo !== TipoMovimiento.ENTRADA ? 'sec' : ''}`}
            style={tipo === TipoMovimiento.ENTRADA ? { backgroundColor: 'var(--green)' } : {}}
          >
            Entrada
          </button>
          <button 
            type="button" 
            onClick={() => setTipo(TipoMovimiento.SALIDA)} 
            className={`btn sm ${tipo !== TipoMovimiento.SALIDA ? 'sec' : ''}`}
            style={tipo === TipoMovimiento.SALIDA ? { backgroundColor: 'var(--red)' } : {}}
          >
            Salida
          </button>
          <button 
            type="button" 
            onClick={() => setTipo(TipoMovimiento.AJUSTE)} 
            className={`btn sm ${tipo !== TipoMovimiento.AJUSTE ? 'sec' : ''}`}
          >
            Ajuste
          </button>
        </div>
      </div>

      {/* Contenedor de la Cantidad */}
      <div style={{ marginBottom: '16px' }}>
        <label>
          {tipo === TipoMovimiento.AJUSTE ? 'Stock Real (Conteo final)' : 'Cantidad'} ({unidad})
        </label>
        {/* boxSizing: border-box fuerza al input a no salirse jamás del div */}
        <input 
          type="number" 
          step="any" 
          min="0" 
          required 
          name="cantidad" 
          placeholder="Ej: 2.5" 
          style={{ boxSizing: 'border-box' }}
        />
      </div>

      {/* Contenedor de la Nota */}
      <div style={{ marginBottom: '20px' }}>
        <label>Nota / Motivo (Opcional)</label>
        <input 
          type="text" 
          name="nota" 
          placeholder="Ej: Venta, Merma, Lote nuevo..." 
          style={{ boxSizing: 'border-box' }}
        />
      </div>

      {/* Botón Guardar */}
      <button 
        type="submit" 
        className="btn" 
        disabled={loading} 
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        {loading ? 'Registrando...' : 'Guardar Movimiento'}
      </button>
    </form>
  )
}