export type AdvancedHeaderFilter = {
  key: string
  label: string
  type: string
  data: string
}

export type AdvnacedTableConfig = {
  filters?: AdvancedHeaderFilter[]
  grid?: boolean
  hover?: boolean
  pointer?: boolean
  risizable?: boolean
  noItemMessage?: string
}

export type AdvancedHeader = {
  id: string
  label: string
  key: string
  sorteable?: boolean
}

export type AdvancedTableProps = {
  headers: AdvancedHeader[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]
  config?: AdvnacedTableConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowClick?: (item: any) => void
}
