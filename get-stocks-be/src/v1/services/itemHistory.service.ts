import { prisma } from '../../../prisma/prisma-client'
import HttpException from '../errors/httpException'
import ItemHistory from '../models/itemHistory.model'
import { LangI18n } from '../../v1/utils/const'

export const getItemByCode = async (itemDCode: string) => {
  if (!itemDCode) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const itemHistory = await prisma.itemHistory.findFirst({ where: { itemDCode }, include: { system: true } })
  if (!itemHistory) {
    throw new HttpException(404, LangI18n.__('item_not_found'))
  }

  return itemHistory
}

export const getItemHistoryByUserId = async (userId: string = '') => {
  if (!userId) throw new HttpException(422, LangI18n.__('item_not_found'))
  const items = await prisma.itemHistory.findMany({
    where: { userId: userId },
    select: {
      updatedAt: true,
      createdAt: true,
      extension: true,
      id: true,
      fileName: true,
      provider: true,
      itemDCode: true,
      cost: true,
      link: true
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: items,
    total: items.length
  }
}

export const getAllItemHistory = async () => {
  const items = await prisma.itemHistory.findMany({
    select: {
      userId: true,
      user: true,
      createdAt: true,
      extension: true,
      id: true,
      fileName: true,
      provider: true,
      updatedAt: true,
      cost: true,
      itemDCode: true,
      link: true
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: items,
    total: items.length
  }
}

export const createItemHistory = async (itemInput: ItemHistory) => {
  return await prisma.itemHistory.create({
    data: {
      userId: itemInput.userId,
      systemId: itemInput.systemId,
      itemDCode: itemInput.itemDCode,
      provider: itemInput.provider,
      fileName: itemInput.fileName,
      extension: itemInput.extension,
      link: itemInput.link,
      provSlug: itemInput.provSlug,
      itemID: itemInput.itemID,
      isPremium: itemInput.isPremium,
      itemType: itemInput.itemType,
      expireTime: new Date()
    },
    include: { system: true }
  })
}

export default { getItemByCode, createItemHistory, getItemHistoryByUserId, getAllItemHistory }
