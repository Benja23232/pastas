import { PrismaClient, Categoria, Unidad } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiamos la base antes de sembrar para evitar duplicados
  await prisma.movimiento.deleteMany()
  await prisma.producto.deleteMany()

  await prisma.producto.create({
    data: {
      numero: 1,
      nombre: 'Ravioles de Ricota',
      categoria: Categoria.RELLENAS,
      descripcion: 'Producción de la mañana',
      unidad: Unidad.KG,
      stock: 5,
    }
  })

  await prisma.producto.create({
    data: {
      numero: 2,
      nombre: 'Fideos al Huevo',
      categoria: Categoria.PASTA_FRESCA,
      descripcion: 'Caja estándar',
      unidad: Unidad.KG,
      stock: 12,
    }
  })

  await prisma.producto.create({
    data: {
      numero: 3,
      nombre: 'Salsa Fileto',
      categoria: Categoria.SALSAS,
      descripcion: 'Tupper grande heladera central',
      unidad: Unidad.LITROS,
      stock: 4,
    }
  })

  console.log('Datos de prueba cargados correctamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })