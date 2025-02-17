export type AdvnacedTableConfig = {
  filters?: any[]
  columnWidths?: any[]
  grid?: boolean
  hover?: boolean
  pointer?: boolean
  risizable?: boolean
}

export type AdvancedHeader = {
  id: string
  label: string
  key: string
  sorteable?: boolean
}

export type AdvancedTableProps = {
  headers: AdvancedHeader[]
  items: any[]
  config?: AdvnacedTableConfig
}
