import User from './user.model'

export type PackagePricingG = {
  id: string
  name: string
  balanceG: number
  balanceP: number
  price: number
  content: string
  createdAt: Date
  updatedAt: Date
}

export type PackagePricingP = {
  id: string
  name: string
  dayExpires: number
  downPerDay: number
  price: number
  content: string
  guideEn?: string
  guideVn?: string
  createdAt: Date
  updatedAt: Date
}

export type PackageOrder = {
  id: string
  userId: string
  user?: User
  expireTime: Date
  guideEn?: string
  guideVn?: string
  isExpired: boolean
  dailyLeft: number
  downDaily: number
  createdAt: Date
  updatedAt: Date
}
