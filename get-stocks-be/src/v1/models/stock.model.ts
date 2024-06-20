import { System } from './system.model'

export enum PackageType {
  G = 'G',
  P = 'P',
  BOTH = 'BOTH'
}

export type Stock = {
  id: string
  name: string
  systemId: string
  system?: System
  host: string
  pathName?: string
  isActive: boolean
  stockTypes?: StockType[]
}

export type StockType = {
  id: string
  type: PackageType
  price: number
  stockId: string
}

export default Stock
