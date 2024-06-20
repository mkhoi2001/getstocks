export type SystemConfig = {
  id: string
  key: string
  value: string
}

export type StockConfig = {
  percent_normal: number
  percent_pre: number
  auto_nor: 1 | 0
  auto_pre: 1 | 0
}
