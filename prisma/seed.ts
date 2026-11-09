import { PrismaClient, Categoria, Unidad, TipoMovimiento } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando carga de datos iniciales (Seed)...')

  const p1 = await prisma.producto.create({
    data: {
      nombre: 'Sorrentinos de Jamón y Queso',
      categoria: Categoria.RELLENAS,
      descripcion: 'Caja de sorrentinos artesanales (aprox 12 unidades).',
      unidad: Unidad.CAJAS,
      stock: 50,
      stockMinimo: 15,
      movimientos: {
        create: {
          tipo: TipoMovimiento.ENTRADA,
          cantidad: 50,
          stockResultante: 50,
          nota: 'Stock inicial - Sistema',
        }
      }
    }
  })

  const p2 = await prisma.producto.create({
    data: {
      nombre: 'Fideos al Huevo',
      categoria: Categoria.PASTA_FRESCA,
      descripcion: 'Fideos cinta ancha al huevo, venta por peso.',
      unidad: Unidad.KG,
      stock: 12.5,
      stockMinimo: 20,
      movimientos: {
        create: {
          tipo: TipoMovimiento.ENTRADA,
          cantidad: 12.5,
          stockResultante: 12.5,
          nota: 'Stock inicial - Sistema',
        }
      }
    }
  })

  const p3 = await prisma.producto.create({
    data: {
      nombre: 'Salsa Fileto',
      categoria: Categoria.SALSAS,
      descripcion: 'Salsa de tomate casera en pote de 500g.',
      unidad: Unidad.UNIDADES,
      stock: 30,
      stockMinimo: 10,
      movimientos: {
        create: {
          tipo: TipoMovimiento.ENTRADA,
          cantidad: 30,
          stockResultante: 30,
          nota: 'Stock inicial - Sistema',
        }
      }
    }
  })

  console.log('Productos de ejemplo creados exitosamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })