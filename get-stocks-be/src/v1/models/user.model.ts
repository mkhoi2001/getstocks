import { PackageOrder } from '@prisma/client'

export type User = {
  id: string
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  phone: string
  balanceG: number
  balanceP: number
  totalDeposit: number
  packageOrder?: PackageOrder | null
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

export type UserAmount = {
  type: 'P' | 'G'
  amount: number
}

export default User
