type GetStockItem = {
  id: string
  name: string
  host: string
  price: number
  status: boolean
  type: string
  typePack: 'G' | 'P' | 'BOTH'
  props: string
  isPre: boolean
  createdAt: Date
  updatedAt: Date
}

export default GetStockItem
