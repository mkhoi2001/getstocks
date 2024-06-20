import { SERVER_CONFIG, SHOW_STOCK_KEY } from './../utils/const'
import { PackageType, StockType } from './../models/stock.model'
import HttpException from '../errors/httpException'
import Stock from '../models/stock.model'
import stockService from './stock.service'
import { getStockService } from './thirdService'
import System from '../models/system.model'
import itemHistoryService from './itemHistory.service'
import ItemHistory from '../models/itemHistory.model'
import { prisma } from 'prisma/prisma-client'
import orderHistoryService from './orderHistory.service'
import userService from './user.service'
import { getDomain } from '../utils/getDomain'
import { LangI18n } from '../../v1/utils/const'

export const getItemById = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const item = await prisma.itemHistory.findUnique({ where: { id } })
  if (!item) {
    throw new HttpException(400, LangI18n.__('item_not_found'))
  }
  return item
}

export const getItemInfo = async (link: string = '', type: PackageType) => {
  if (!link || !type) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const url = new URL(link)
  const mainHost = url.origin
  const stockFind = await stockService.getStockByHostAndType(link, type)
  const itemInfo = await getStockService.getItemInfo(stockFind.system, link, 1)
  console.log('Info Item: ', itemInfo)
  const itemReturn = {
    itemSite: itemInfo?.itemSite,
    itemName: itemInfo?.itemName,
    itemTitle: itemInfo?.title,
    itemDesc: itemInfo?.desc,
    itemExt: itemInfo?.itemExt,
    itemThumb: itemInfo?.itemThumb,
    itemLink: link,
    itemOrigin: url.origin,
    itemSlug: itemInfo?.support?.itemslug,
    itemType: type
  }
  return itemReturn
}

export const getCodeItemDownload = async (userId: string = '', link: string = '', type: PackageType) => {
  if (!link || !type) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  let result: any = {}
  if (type == PackageType.G) {
    result = await preDownloadItemG(userId, link, type)
  } else if (type == PackageType.P) {
    result = await preDownloadItemP(userId, link, type)
  }

  const itemReturn: any = {
    ...result?.itemHistory,
    email: result?.userUpdate?.email,
    link: link,
    type: type,
    $: result?.user?.balanceG,
    P: result?.user?.balanceP
  }

  if (type == PackageType.G) {
    ;(itemReturn.$ = result?.userUpdate?.balanceG), (itemReturn.P = result?.userUpdate?.balanceP)
  }

  if (type == PackageType.P) {
    itemReturn.dailyLeft = result?.userUpdate?.dailyLeft
  }

  console.log('result ', result)
  return itemReturn
}

export const getLinkDownLoad = async (link: string) => {
  const url = new URL(link)
  const mainHost = url.origin
  // const stockFindPromise = stockService.getStockByHost(mainHost)
  // const itemInfoPromise = getItemInfo(link)
  // const [stockFind, itemInfo] = await Promise.all([stockFindPromise, itemInfoPromise])

  const stockFind = await stockService.getStockByHost(mainHost)
  const linkDownload = await getStockService.getLinkDownload(stockFind.system, link, 1)
  return linkDownload
}

export const getDownloadInfoFromHost = async (stock: Stock, link: string) => {
  const linkDownload: { email: string; provSlug: string; itemID: string; itemType: string; isPremium: number } =
    await getStockService.getLinkDownload(stock.system, link, 1)

  console.log('linkDown ', linkDownload)

  const downloadData = await getStockService.checkDownloadStatus(
    stock.system,
    linkDownload.provSlug,
    linkDownload.itemID,
    linkDownload.isPremium,
    linkDownload.itemType
  )

  if (downloadData?.result?.status === 0) {
    throw new HttpException(400, LangI18n.__('item_download_failed'))
  }

  return { downloadData, linkDownload }
}

export const checkDownloadStatus = async (link: string) => {
  const url = new URL(link)
  const mainHost = url.origin
  const stockFind = await stockService.getStockByHost(mainHost)

  const { downloadData } = await getDownloadInfoFromHost(stockFind as Stock, link)

  return downloadData?.result
}

export const createItemDowload = async (userId: string = '', link: string) => {
  if (!userId || !link) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const url = new URL(link)
  const mainHost = url.origin
  const stockFind = await stockService.getStockByHost(mainHost)
  const { downloadData, linkDownload } = await getDownloadInfoFromHost(stockFind as Stock, link)

  if (!downloadData?.result?.status) {
    throw new HttpException(400, LangI18n.__('item_download_failed'))
  }
  const resultHost = downloadData?.result
  const itemInput = {
    userId: userId,
    systemId: stockFind.systemId,
    itemDCode: resultHost?.itemDCode,
    provider: stockFind.name,
    fileName: resultHost?.itemFilename,
    extension: resultHost?.itemExt,
    link: link,
    provSlug: linkDownload.provSlug,
    itemID: linkDownload.itemID,
    isPremium: linkDownload.isPremium,
    itemType: linkDownload.itemType
  }
  const itemHistory = await itemHistoryService.createItemHistory(itemInput as ItemHistory)
  return itemHistory
}

export const preDownloadItemG = async (userId: string = '', link: string = '', type: PackageType) => {
  if (!link || type !== PackageType.G || !userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const stockFindPromise = stockService.getStockByHostAndType(link, type)
  const userPromise = userService.getUserById(userId)

  const [stockFind, user] = await Promise.all([stockFindPromise, userPromise])

  const typeG = stockFind.stockTypes.find((stock) => stock.type === PackageType.G)

  if (!typeG) {
    throw new HttpException(404, LangI18n.__('stock_not_supported'))
  }

  let updateUserPromise
  const transActions = []
  if (typeG) {
    if (user.balanceG < typeG?.price) {
      throw new HttpException(404, LangI18n.__('user_cannot_download'))
    }

    // tru tien vo balanceG
    updateUserPromise = prisma.user.update({
      where: { id: userId },
      data: {
        balanceG: {
          decrement: typeG?.price
        }
      }
    })

    transActions.push(updateUserPromise)
  } else {
    throw new HttpException(404, LangI18n.__('user_cannot_download'))
    // tru luot down hang ngay
    // updateUserPromise = prisma.packageOrder.update({
    //   where: { userId: userId },
    //   data: {
    //     dailyLeft: {
    //       decrement: 1
    //     }
    //   }
    // })
  }

  const itemInput = await downloadItem(userId, link, stockFind as Stock)
  const stockG = stockFind.stockTypes.find((stockType) => stockType.type == PackageType.G)
  itemInput.cost = stockG?.price || 0
  const itemHistoryPromise = prisma.itemHistory.create({
    data: itemInput,
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true }
  })

  transActions.unshift(itemHistoryPromise)
  const [itemHistory, userUpdate] = await prisma.$transaction(transActions)

  return { itemHistory, userUpdate, itemInput, user }
}

export const preDownloadItemP = async (userId: string = '', link: string = '', type: PackageType) => {
  if (!link || type !== PackageType.P || !userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const url = new URL(link)
  const mainHost = url.origin
  const stockFindPromise = stockService.getStockByHostAndType(mainHost, type)
  const userPromise = userService.checkUserPackageOrder(userId)

  const [stockFind, user] = await Promise.all([stockFindPromise, userPromise])

  const typeP = stockFind.stockTypes.find((stock) => stock.type === PackageType.P)

  if (!typeP) {
    throw new HttpException(404, LangI18n.__('stock_not_supported'))
  }

  let updateUserPromise
  if (user?.packageOrder && user?.packageOrder?.dailyLeft > 0) {
    // tru luot down hang ngay
    updateUserPromise = prisma.packageOrder.update({
      where: { userId: userId },
      data: {
        dailyLeft: {
          decrement: 1
        }
      }
    })
  } else if (!user?.packageOrder) {
    if (user.balanceP < typeP?.price) {
      throw new HttpException(404, LangI18n.__('user_cannot_download'))
    }

    // tru tien vo balanceP
    updateUserPromise = prisma.user.update({
      where: { id: userId },
      data: {
        balanceP: {
          decrement: typeP?.price
        }
      }
    })
  } else {
    throw new HttpException(404, LangI18n.__('user_cannot_download'))
  }

  const itemInput = await downloadItem(userId, link, stockFind as Stock)
  const stockP = stockFind.stockTypes.find((stockType) => stockType.type == PackageType.P)
  itemInput.cost = stockP?.price || 0
  const itemHistoryPromise = prisma.itemHistory.create({
    data: itemInput,
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true }
  })
  const [itemHistory, userUpdate] = await prisma.$transaction([itemHistoryPromise, updateUserPromise])
  return { itemHistory, userUpdate, itemInput, user }
}

export const downloadItem = async (userId: string, link: string, stockFind: Stock): Promise<any> => {
  if (!link || !stockFind || !userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const { downloadData, linkDownload } = await getDownloadInfoFromHost(stockFind as Stock, link)
  if (!downloadData?.result?.status) {
    throw new HttpException(400, 'Chưa down được item. Vui lòng thử lại sau')
  }
  const resultHost = downloadData?.result
  const itemInput = {
    userId: userId,
    systemId: stockFind.systemId,
    itemDCode: resultHost?.itemDCode,
    provider: stockFind.name,
    fileName: resultHost?.itemFilename,
    extension: resultHost?.itemExt,
    link: link,
    provSlug: linkDownload.provSlug,
    itemID: '' + linkDownload.itemID,
    isPremium: linkDownload.isPremium,
    itemType: linkDownload.itemType,
    cost: 0
  }
  // const itemHistory = await itemHistoryService.createItemHistory(itemInput as ItemHistory)
  // return itemHistory
  return itemInput
}

export const preDownloadAutoItemG = async (userId: string | undefined, link: string | undefined, type: PackageType) => {
  if (!link || type !== PackageType.G || !userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const stockFindPromise = stockService.getAutoStockByHostAndType(link, type)
  const userPromise = userService.getUserById(userId)

  const [stockFind, user] = await Promise.all([stockFindPromise, userPromise])

  const typeG = stockFind.stockTypes.find((stock: { type: PackageType }) => stock.type === PackageType.G)

  if (!typeG) {
    throw new HttpException(404, LangI18n.__('stock_not_supported'))
  }

  let updateUserPromise
  const transActions = []
  if (typeG) {
    if (user.balanceG < typeG?.price) {
      throw new HttpException(404, LangI18n.__('user_cannot_download'))
    }

    // tru tien vo balanceG
    updateUserPromise = prisma.user.update({
      where: { id: userId },
      data: {
        balanceG: {
          decrement: typeG?.price
        }
      }
    })

    transActions.push(updateUserPromise)
  } else {
    throw new HttpException(404, LangI18n.__('user_cannot_download'))
  }

  const itemInput = await downloadItem(userId, link, stockFind as Stock)
  const stockG = stockFind.stockTypes.find((stockType: { type: PackageType }) => stockType.type == PackageType.G)
  itemInput.cost = stockG?.price || 0
  const itemHistoryPromise = prisma.itemHistory.create({
    data: itemInput,
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true }
  })

  transActions.unshift(itemHistoryPromise)
  const [itemHistory, userUpdate] = await prisma.$transaction(transActions)

  return { itemHistory, userUpdate, itemInput, user }
}

const downloadItemTypeG = async (userId: string = '', link: string = '', type: PackageType) => {
  if (SERVER_CONFIG[SHOW_STOCK_KEY].auto_nor == 1) {
    console.log('AUTO STOCK G:: TRUE')
    const data = await preDownloadAutoItemG(userId, link, type)
    return data.itemHistory
  }
  console.log('AUTO STOCK G:: FALSE')

  const { itemHistory, userUpdate } = await preDownloadItemG(userId, link, type)
  // console.log('userUGgggg ', userUpdate)

  return itemHistory
}

export const preDownloadAutoItemP = async (userId: string = '', link: string = '', type: PackageType) => {
  if (!link || type !== PackageType.P || !userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const stockFindPromise = stockService.getAutoStockByHostAndType(link, type)
  const userPromise = userService.getUserById(userId)

  const [stockFind, user] = await Promise.all([stockFindPromise, userPromise])

  const typeP = stockFind.stockTypes.find((stock: { type: PackageType }) => stock.type === PackageType.P)

  if (!typeP) {
    throw new HttpException(404, LangI18n.__('stock_not_supported'))
  }

  let updateUserPromise
  if (user?.packageOrder && user?.packageOrder?.dailyLeft > 0) {
    // tru luot down hang ngay
    updateUserPromise = prisma.packageOrder.update({
      where: { userId: userId },
      data: {
        dailyLeft: {
          decrement: 1
        }
      }
    })
  } else if (!user?.packageOrder) {
    if (user.balanceP < typeP?.price) {
      throw new HttpException(404, LangI18n.__('user_cannot_download'))
    }

    // tru tien vo balanceP
    updateUserPromise = prisma.user.update({
      where: { id: userId },
      data: {
        balanceP: {
          decrement: typeP?.price
        }
      }
    })
  } else {
    throw new HttpException(404, LangI18n.__('user_cannot_download'))
  }

  const itemInput = await downloadItem(userId, link, stockFind as Stock)
  const stockP = stockFind.stockTypes.find((stockType: { type: PackageType }) => stockType.type == PackageType.P)
  itemInput.cost = stockP?.price || 0
  const itemHistoryPromise = prisma.itemHistory.create({
    data: itemInput,
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true }
  })
  const [itemHistory, userUpdate] = await prisma.$transaction([itemHistoryPromise, updateUserPromise])
  return { itemHistory, userUpdate, itemInput, user }
}

export const downloadItemTypeP = async (userId: string = '', link: string = '', type: PackageType) => {
  if (SERVER_CONFIG[SHOW_STOCK_KEY].auto_pre == 1) {
    console.log('AUTO STOCK P:: TRUE')

    const data = await preDownloadAutoItemP(userId, link, type)
    return data.itemHistory
  }
  const { itemHistory, userUpdate } = await preDownloadItemP(userId, link, type)

  // console.log('userUPpppp ', userUpdate)
  return itemHistory
}

export const generateLinkDownloadOwn = async (itemHistory: ItemHistory) => {
  const link = `/item?code=${itemHistory.itemDCode}`
  return link
}

export const reDownloadItem = async (id: string = '') => {
  const itemFind = await getItemById(id)

  const url = new URL(itemFind.link)
  const mainHost = url.origin
  const stockFind = await stockService.getStockByHost(mainHost)

  const downloadData = await getStockService.checkDownloadStatus(
    stockFind.system,
    itemFind.provSlug,
    itemFind.itemID,
    itemFind.isPremium,
    itemFind.itemType
  )
  const resultHost = downloadData?.result
  const itemHistory = await prisma.itemHistory.update({
    where: { id: id },
    data: {
      itemDCode: resultHost.itemDCode
    },
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true }
  })

  return itemHistory
}

export default {
  getCodeItemDownload,
  // downloadItem,
  getItemById,
  generateLinkDownloadOwn,
  downloadItemTypeP,
  reDownloadItem,
  downloadItemTypeG,
  getDownloadInfoFromHost,
  getItemInfo,
  getLinkDownLoad,
  checkDownloadStatus,
  createItemDowload
}
