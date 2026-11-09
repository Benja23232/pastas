import ProductForm from '@/components/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoProductoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-ocre-600 transition">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>
      <h1 className="text-2xl font-bold text-stone-800 dark:text-white">Crear Nuevo Producto</h1>
      <ProductForm />
    </div>
  )
}