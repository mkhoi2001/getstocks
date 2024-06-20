import { PackagePricingG, PackagePricingP } from './package.model'
import { PackageType } from './stock.model'
import { User } from './user.model'

export enum OrderStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export type OrderHistory = {
  id: string
  userId: string
  user: User
  packageType: PackageType
  packagePricingGId?: string
  packagePricingPId?: string
  packagePricingG?: PackagePricingG
  packagePricingP?: PackagePricingP
  content: string
  status: OrderStatus
  provider: string
  costPayment: number
  cardNumber?: string
  phone: string
  reason?: string
  cost: number
  currency: string
  createdAt: Date
  updatedAt: Date
}
