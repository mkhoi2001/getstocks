import User from './user.model'
import System from './system.model'
import { number } from 'joi'

type ItemHistory = {
  id: string
  userId: string
  user?: User
  systemId: string
  system?: System
  link: string
  itemDCode: string
  provSlug?: string
  itemID?: string
  cost: number
  itemType?: string
  isPremium?: number
  provider: string
  fileName: string
  extension: string
  expireTime: Date | null
  createdAt: Date
  updatedAt: Date
}

export default ItemHistory
