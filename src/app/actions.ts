'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Categoria, Unidad, TipoMovimiento } from '@prisma/client'

// --- PRODUCTOS ---

export async function createProducto(data: {
  numero: number, 
  nombre: string, 
  categoria: Categoria, 
  descripcion: string, 
  unidad: Unidad, 
  stockInicial: number
}) {
  if (!data.nombre || data.nombre.trim() === '') {
    return { success: false, error: 'El nombre es obligatorio' }
  }
  if (data.stockInicial < 0) {
    return { success: false, error: 'El stock no puede ser negativo' }
  }

  try {
    await prisma.producto.create({
      data: {
        numero: data.numero,
        nombre: data.nombre,
        categoria: data.categoria,
        descripcion: data.descripcion,
        unidad: data.unidad,
        stock: data.stockInicial,
        movimientos: data.stockInicial > 0 ? {
          create: {
            tipo: TipoMovimiento.ENTRADA,
            cantidad: data.stockInicial,
            stockResultante: data.stockInicial,
            nota: 'Ingreso a heladera',
          }
        } : undefined
      }
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al registrar el tupper' }
  }
}

export async function updateProducto(id: string, data: {
  numero: number,
  nombre: string, 
  categoria: Categoria, 
  descripcion: string, 
  unidad: Unidad
}) {
  if (!data.nombre || data.nombre.trim() === '') {
    return { success: false, error: 'El nombre es obligatorio' }
  }

  try {
    await prisma.producto.update({
      where: { id },
      data: {
        numero: data.numero,
        nombre: data.nombre,
        categoria: data.categoria,
        descripcion: data.descripcion,
        unidad: data.unidad,
      }
    })
    revalidatePath('/')
    revalidatePath(`/productos/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al actualizar el tupper' }
  }
}

export async function deleteProducto(id: string) {
  try {
    await prisma.producto.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar el producto' }
  }
}

// --- MOVIMIENTOS ---

export async function createMovimiento(productoId: string, tipo: TipoMovimiento, cantidad: number, nota: string) {
  if (cantidad < 0) {
    return { success: false, error: 'La cantidad no puede ser negativa' }
  }
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      const producto = await tx.producto.findUnique({
        where: { id: productoId }
      })

      if (!producto) throw new Error('Producto no encontrado')

      let stockResultante = producto.stock

      if (tipo === TipoMovimiento.ENTRADA) {
        stockResultante = producto.stock + cantidad
      } else if (tipo === TipoMovimiento.SALIDA) {
        if (cantidad > producto.stock) {
          throw new Error('No hay stock suficiente para esta salida')
        }
        stockResultante = producto.stock - cantidad
      } else if (tipo === TipoMovimiento.AJUSTE) {
        // En ajuste, la cantidad ingresada pasa a ser el stock final real
        stockResultante = cantidad
      }

      const movimiento = await tx.movimiento.create({
        data: {
          productoId,
          tipo,
          cantidad,
          stockResultante,
          nota
        }
      })

      await tx.producto.update({
        where: { id: productoId },
        data: { stock: stockResultante }
      })

      return movimiento
    })

    revalidatePath('/')
    revalidatePath(`/productos/${productoId}`)
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al registrar el movimiento' }
  }
}