import { preDownloadAutoItemG } from './item.service'
import { prisma } from '../../../prisma/prisma-client'
import HttpException from '../errors/httpException'
import Stock, { PackageType } from '../models/stock.model'
import { CURRENCY, GETSTOCKSTYPE, GET_STOCK_PROV, LangI18n } from '../utils/const'
import defaultService from './default.service'
import stockService from './stock.service'
import getStockService from './thirdService/getStock.service'
import userService from './user.service'
import systemService from './system.service'
import System from '../models/system.model'
import systemConfigService from './systemConfig.service'

const getSysToExec = async () => {
  const systemId = await defaultService.getDefaultDataByType(GETSTOCKSTYPE)
  const system = await systemService.getSystemById(systemId?.dataId)
  return system
}

export const getItemInfo = async (link: string = '', type: PackageType) => {
  if (!link || !type) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const systemId = await defaultService.getDefaultDataByType(GETSTOCKSTYPE)
  const system = await systemService.getSystemById(systemId?.dataId)

  const url = new URL(link)
  const response = await getStockService.getItemInfo(system, link, 1)
  if (response?.status != 200) {
    switch (response?.title) {
      case 'Not found':
        throw new HttpException(400, LangI18n.__('link_not_found'))
        break
      default:
        throw new HttpException(400, LangI18n.__('bad_request'))
    }
  }

  const itemInfo = response?.result

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

const getLinkDownload = async (system: System, link: string) => {
  const linkDownload: any = await getStockService.getLinkDownload(system, link, 1)
  if (linkDownload?.status != 200) {
    switch (linkDownload.status) {
      case 'Cant get link info':
        throw new HttpException(400, LangI18n.__('link_not_found'))
        break
      case 'Bad request':
        throw new HttpException(400, LangI18n.__('gs_bad_request'))
        break

      default:
        throw new HttpException(400, LangI18n.__('link_not_found'))
    }
  }
  return linkDownload
}

const checkDownload = async (system: System, linkDownload: any) => {
  const downloadData = await getStockService.checkDownloadStatus(
    system,
    linkDownload?.result?.provSlug,
    linkDownload?.result?.itemID,
    linkDownload?.result?.isPremium,
    linkDownload?.result?.itemType
  )

  if (downloadData?.result?.status === 0) {
    throw new HttpException(400, LangI18n.__('item_download_failed'))
  }

  console.log('downloadData:: ', downloadData)

  return downloadData
}

export const getDownloadInfoFromHost = async (system: System, link: string) => {
  const linkDownload: any = await getStockService.getLinkDownload(system, link, 1)
  if (linkDownload?.status != 200) {
    switch (linkDownload.status) {
      case 'Cant get link info':
        throw new HttpException(400, LangI18n.__('link_not_found'))
        break
      case 'Bad request':
        throw new HttpException(400, LangI18n.__('gs_bad_request'))
        break

      default:
        throw new HttpException(400, LangI18n.__('link_not_found'))
    }
  }
  const downloadData = await getStockService.checkDownloadStatus(
    system,
    linkDownload?.result?.provSlug,
    linkDownload?.result?.itemID,
    linkDownload?.result?.isPremium,
    linkDownload?.result?.itemType
  )

  if (downloadData?.result?.status === 0) {
    throw new HttpException(400, LangI18n.__('item_download_failed'))
  }

  return { downloadData, linkDownload: linkDownload?.result }
}

export const downloadItem = async (userId: string, link: string, system: System): Promise<any> => {
  const { downloadData, linkDownload } = await getDownloadInfoFromHost(system, link)

  const resultHost = downloadData?.result

  const itemInput = {
    userId: userId,
    systemId: system.id,
    itemDCode: resultHost?.itemDCode,
    // provider: stockFind.name,
    fileName: resultHost?.itemFilename,
    extension: resultHost?.itemExt,
    link: link,
    provSlug: linkDownload.provSlug,
    itemID: '' + linkDownload.itemID,
    isPremium: linkDownload.isPremium,
    itemType: linkDownload.itemType,
    cost: 0
  }

  return itemInput
}

export const checkDownloadStatus = async (link: string) => {
  const url = new URL(link)
  const mainHost = url.origin
  const stockFind = await stockService.getStockByHost(mainHost)

  //const { downloadData } = await getDownloadInfoFromHost(stockFind as Stock, link)

  //return downloadData?.result
}

export const preDownloadItemG = async (userId: string = '', link: string = '', type: PackageType) => {
  if (!link || type !== PackageType.G || !userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const userPromise = userService.getUserById(userId)
  const systemPromise = getSysToExec()
  const currencyPromise = systemConfigService.getSystemDataByKey(CURRENCY)

  const [user, system, currencyData] = await Promise.all([userPromise, systemPromise, currencyPromise])

  const linkDownload = await getLinkDownload(system, link)
  // const { downloadData, linkDownload } = await getDownloadInfoFromHost(system, link)
  const stock = await prisma.getStockItem.findFirst({
    where: {
      type: linkDownload?.result?.itemType,
      status: true,
      OR: [
        {
          typePack: 'G'
        },
        { typePack: 'BOTH' }
      ]
    }
  })

  if (!stock) {
    throw new HttpException(400, LangI18n.__('stock_cannot_download'))
  }

  let updateUserPromise: any = ''
  const transActions = []
  const currency = currencyData?.value ? parseFloat(currencyData?.value) : 24.8
  const price = parseFloat(stock?.price)
  const comparePrice = Math.ceil((price * currency) / 100) * 100
  console.log('price ', price, stock?.price)

  if (Math.ceil(user.balanceG * currency) < comparePrice) {
    throw new HttpException(404, LangI18n.__('user_cannot_download'))
  }

  // tru tien vo balanceG
  updateUserPromise = prisma.user.update({
    where: { id: userId },
    data: {
      balanceG: {
        decrement: price
      }
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      phone: true,
      balanceG: true,
      balanceP: true,
      createdAt: true,
      updatedAt: true,
      firstName: true,
      lastName: true,
      totalDeposit: true,
      packageOrder: true
    }
  })

  // check status download
  const downloadData: any = await checkDownload(system, linkDownload)
  transActions.push(updateUserPromise)

  const itemInput = {
    userId: userId,
    systemId: system.id,
    itemDCode: downloadData?.result?.itemDCode,
    provider: stock.name,
    fileName: downloadData?.result?.itemFilename,
    extension: downloadData?.result?.itemExt,
    link: link,
    provSlug: linkDownload.result?.provSlug,
    itemID: linkDownload.result?.itemID,
    isPremium: linkDownload.result?.isPremium,
    itemType: linkDownload.itemType,
    cost: price
  }

  const itemHistoryPromise = prisma.itemHistory.create({
    data: itemInput,
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true }
  })

  transActions.unshift(itemHistoryPromise)
  const [itemHistory, userUpdate] = await prisma.$transaction(transActions)

  // return { itemHistory, userUpdate, itemInput, user }
  return { item: itemHistory, user: userUpdate }
}

const preDownloadItemP = async (userId: string = '', link: string = '', type: PackageType) => {
  if (!link || type !== PackageType.P || !userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const userPromise = userService.getUserById(userId)
  const systemPromise = getSysToExec()
  const currencyPromise = systemConfigService.getSystemDataByKey(CURRENCY)

  const [user, system, currencyData] = await Promise.all([userPromise, systemPromise, currencyPromise])

  const linkDownload = await getLinkDownload(system, link)
  // const { downloadData, linkDownload } = await getDownloadInfoFromHost(system, link)
  const stock = await prisma.getStockItem.findFirst({
    where: {
      type: linkDownload?.result?.itemType,
      status: true,
      OR: [
        {
          typePack: 'P'
        },
        { typePack: 'BOTH' }
      ]
    }
  })

  if (!stock) {
    throw new HttpException(400, LangI18n.__('stock_cannot_download'))
  }

  let updateUserPromise: any = ''
  const transActions = []
  const currency = currencyData?.value ? parseFloat(currencyData?.value) : 24.8
  const price = parseFloat(stock?.price)
  const comparePrice = Math.ceil((price * currency) / 100) * 100
  console.log('price ', price, stock?.price)
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
    if (Math.ceil(user.balanceP * currency) < comparePrice) {
      throw new HttpException(404, LangI18n.__('user_cannot_download'))
    }

    // tru tien vo balanceP
    updateUserPromise = prisma.user.update({
      where: { id: userId },
      data: {
        balanceP: {
          decrement: price
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        phone: true,
        balanceG: true,
        balanceP: true,
        createdAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
        totalDeposit: true,
        packageOrder: true
      }
    })
  } else {
    throw new HttpException(404, LangI18n.__('user_cannot_download'))
  }

  // check status download
  const downloadData: any = await checkDownload(system, linkDownload)
  transActions.push(updateUserPromise)

  const itemInput = {
    userId: userId,
    systemId: system.id,
    itemDCode: downloadData?.result?.itemDCode,
    provider: stock.name,
    fileName: downloadData?.result?.itemFilename,
    extension: downloadData?.result?.itemExt,
    link: link,
    provSlug: linkDownload.result?.provSlug,
    itemID: linkDownload.result?.itemID,
    isPremium: linkDownload.result?.isPremium,
    itemType: linkDownload.itemType,
    cost: price
  }

  const itemHistoryPromise = prisma.itemHistory.create({
    data: itemInput,
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true }
  })

  transActions.unshift(itemHistoryPromise)
  const [itemHistory, userUpdate] = await prisma.$transaction(transActions)

  // return { itemHistory, userUpdate, itemInput, user }
  return { item: itemHistory, user: userUpdate }
}

const downloadItemTypeG = async (userId: string = '', link: string = '', type: PackageType) => {
  return await preDownloadItemG(userId, link, type)
}
const downloadItemTypeP = async (userId: string = '', link: string = '', type: PackageType) => {
  return await preDownloadItemP(userId, link, type)
}

export const getCodeItemDownload = async (userId: string = '', link: string = '', type: PackageType) => {
  if (!link || !type) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const currencyData = await systemConfigService.getSystemDataByKey(CURRENCY)

  let result: any = {}
  if (type == PackageType.G) {
    result = await preDownloadItemG(userId, link, type)
  } else if (type == PackageType.P) {
    result = await preDownloadItemP(userId, link, type)
  }

  const dataG = result?.user?.balanceG
    ? Math.ceil(result?.user?.balanceG * parseFloat(currencyData?.value))
    : result?.user?.balanceG * 24.8
  const dataP = result?.user?.balanceP
    ? Math.ceil(result?.user?.balanceP * parseFloat(currencyData?.value))
    : result?.user?.balanceP * 24.8

  const itemReturn: any = {
    ...result?.item,
    email: result?.user?.email,
    link: link,
    type: type,
    G: dataG,
    P: dataP
  }

  if (type == PackageType.G) {
    ;(itemReturn.G = dataG), (itemReturn.P = dataP)
  }

  if (type == PackageType.P) {
    itemReturn.dailyLeft = result?.user?.dailyLeft
  }

  console.log('result ', result)
  return itemReturn
}

const updateGetStockProvider = async (item: any, percent: number) => {
  const pricePlus = Math.ceil(item?.provPrice * (percent / 100))
  const price = item?.provPrice + pricePlus

  return await prisma.getStockItem.upsert({
    where: {
      name: item?.provName
    },
    update: {
      name: item?.provName,
      host: item?.provHost,
      price: price,
      status: !!item?.status,
      type: item?.provType,
      props: JSON.stringify(item),
      isPre: !!item?.isPremium
    },
    create: {
      name: item?.provName,
      host: item?.provHost,
      price: price,
      type: item?.provType,
      typePack: item?.isPremium == 1 ? 'G' : 'P',
      status: !!item?.status,
      props: JSON.stringify(item),
      isPre: !!item?.isPremium
    }
  })
}

const autoUpdateItems = async () => {
  try {
    let percentConfig: any = await systemConfigService.getSystemDataByKey(GET_STOCK_PROV)
    percentConfig = JSON.parse(percentConfig.value)
    const system = await defaultService.getDefaultDataByType(GETSTOCKSTYPE)
    const data = await getStockService.getProviderList(system?.dataId)

    await data?.preProvider?.forEach(async (item: any) => {
      // await updateGetStockProvider(item, Number(percentConfig.nor))
      await updateGetStockProvider(item, Number(percentConfig.pre))
    })

    await data?.norProvider?.forEach(async (item: any) => {
      await updateGetStockProvider(item, Number(percentConfig.pre))
    })
  } catch (err) {
    console.log('error autoUpdateItems:: ', err)
  }
}

const updateItems = async () => {
  try {
    let percentConfig: any = await systemConfigService.getSystemDataByKey(GET_STOCK_PROV)
    percentConfig = JSON.parse(percentConfig.value)

    const gsStocks = await prisma.getStockItem.findMany({})
    const percent = percentConfig.pre
    console.log('precent: ', percent)
    const updateItemPromise = await gsStocks.map((item) => {
      const props = JSON.parse(item?.props || '')
      // const percent = item?.typePack == 'G' ? percentConfig.nor : percentConfig.pre

      const pricePlus = Math.ceil(props?.provPrice * (percent / 100))
      const price = props?.provPrice + pricePlus

      console.log('price ', price, item.price, props?.provPrice, item.name)

      return prisma.getStockItem.update({
        where: { id: item.id },
        data: {
          price: price
        }
      })
    })

    await prisma.$transaction(updateItemPromise)
  } catch (err) {
    console.log('error updateItems:: ', err)
  }
}

const getAllStockNormal = async () => {
  const data = await prisma.getStockItem.findMany({
    where: {
      OR: [{ typePack: 'G' }, { typePack: 'BOTH' }],
      status: true
    },
    select: {
      id: true,
      name: true,
      price: true,
      isPre: true,
      typePack: true
    }
  })

  return {
    content: data,
    total: data.length
  }
}
const getAllStockPremium = async () => {
  const data = await prisma.getStockItem.findMany({
    where: {
      OR: [{ typePack: 'P' }, { typePack: 'BOTH' }],
      status: true
    },
    select: {
      id: true,
      name: true,
      price: true,
      isPre: true,
      typePack: true
    }
  })

  return {
    content: data,
    total: data.length
  }
}

const getAllStocks = async () => {
  const data = await prisma.getStockItem.findMany({})
  return {
    content: data,
    total: data.length
  }
}

const findStock = async (id: string) => {
  return await prisma.getStockItem.findFirst({ where: { id: id } })
}

const getStock = async (id: string) => {
  const stock = await findStock(id)

  if (!stock) {
    throw new HttpException(404, 'Stock not found')
  }

  return stock
}

const updateStatus = async (id: string, status: boolean) => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const stock = await getStock(id)
  await prisma.getStockItem.update({
    where: { id: id },
    data: {
      status
    }
  })
  return 'ok'
}

const changeTypePackProvider = async (id: string, typePack: PackageType) => {
  const provder = await getStock(id)
  await prisma.getStockItem.update({
    where: { id: id },
    data: {
      typePack
    }
  })
  return 'ok'
}

export default {
  getItemInfo,
  downloadItemTypeG,
  downloadItemTypeP,
  preDownloadItemG,
  downloadItem,
  checkDownloadStatus,
  autoUpdateItems,
  getAllStockNormal,
  getAllStockPremium,
  getAllStocks,
  updateStatus,
  getStock,
  changeTypePackProvider,
  getCodeItemDownload,
  updateItems
}
