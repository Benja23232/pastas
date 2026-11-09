import { Categoria, Unidad, TipoMovimiento } from "@prisma/client"

export const categoriasMap: Record<Categoria, string> = {
  PASTA_FRESCA: "Pasta fresca",
  PASTA_SECA: "Pasta seca",
  RELLENAS: "Rellenas",
  NOQUIS: "Ñoquis",
  TAPAS_MASAS: "Tapas y masas",
  SALSAS: "Salsas",
  INSUMOS: "Insumos",
  OTROS: "Otros"
}

export const unidadesMap: Record<Unidad, string> = {
  KG: "kg",
  GRAMOS: "gramos",
  LITROS: "litros",
  UNIDADES: "unidades",
  PAQUETES: "paquetes",
  CAJAS: "cajas",
  BANDEJAS: "bandejas"
}

export const tipoMovimientoMap: Record<TipoMovimiento, string> = {
  ENTRADA: "Entrada",
  SALIDA: "Salida",
  AJUSTE: "Ajuste"
}