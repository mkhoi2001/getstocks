import Stock from '../models/stock.model'
import { prisma } from '../../../prisma/prisma-client'
import HttpException from '../errors/httpException'
import { PackageType } from '@prisma/client'
import { StockType } from '../models/stock.model'
import systemService from './system.service'
import { getDomain, getPathName } from '../utils/getDomain'
import {
  AUTO_STOCK_G_KEY,
  AUTO_STOCK_P_KEY,
  GETSTOCKSTYPE,
  LangI18n,
  SERVER_CONFIG,
  SHOW_STOCK_KEY
} from '../../v1/utils/const'
import { checkServerConfig, generateRandomString } from '../utils/utilFuncs'
import defaultService from './default.service'
import getStockService from './thirdService/getStock.service'
import systemConfigService from './systemConfig.service'

type StockUpdateInput = {
  name?: string
  systemId?: string
  host?: string
  pathName?: string
  priceG: number
  priceP: number
}

export const getStockById = async (id: string) => {
  const stock = await prisma.stock.findUnique({ where: { id: id }, include: { stockTypes: true } })
  if (!stock) {
    throw new HttpException(404, LangI18n.__('stock_not_found'))
  }
  return stock
}

export const getAllActiveStocks = async () => {
  const stocks = await prisma.stock.findMany({
    where: { isActive: true },
    select: { name: true, stockTypes: true }
  })
  return {
    content: stocks,
    total: stocks.length
  }
}

export const getAllAutoStockNormal = async () => {
  const system = await defaultService.getDefaultDataByType(GETSTOCKSTYPE)
  const data = await getStockService.getProviderList(system?.dataId)
  const percent = parseFloat(SERVER_CONFIG[SHOW_STOCK_KEY].percent_normal)

  let dataReturn: any = []
  if (data.preProvider) {
    dataReturn = data.preProvider.map((item: any) => {
      return {
        name: item.provName,
        id: item.provSlug + item.provHost,
        host: item.provHost,
        systemId: system.dataId,
        stockTypes: [
          {
            id: item.provSlug + item.provHost + 'typeG',
            type: 'G',
            // price: +((+item.provPrice * (100 + percent)) / 100).toFixed(3)
            price: +(+item.provPrice + (+item.provPrice * percent) / 100).toFixed(3)
          },
          {
            id: item.provSlug + item.provHost + 'typeP',
            type: 'P',
            // price: +((+item.provPriceBonus * (100 + percent)) / 100).toFixed(3)
            price: +(+item.provPriceBonus + (+item.provPriceBonus * percent) / 100).toFixed(3)
          }
        ]
      }
    })
  }
  return dataReturn
}
export const getAllAutoStockPre = async () => {
  const system = await defaultService.getDefaultDataByType(GETSTOCKSTYPE)
  const systemData = await systemService.getSystemById(system?.dataId)
  const data = await getStockService.getProviderList(system?.dataId)
  const percent = parseFloat(SERVER_CONFIG[SHOW_STOCK_KEY].percent_normal)

  let dataReturn: any = []
  if (data.norProvider) {
    dataReturn = data.norProvider.map((item: any) => {
      return {
        name: item.provName,
        id: item.provSlug + item.provHost,
        host: item.provHost,
        systemId: system.dataId,
        system: systemData,
        stockTypes: [
          {
            id: item.provSlug + item.provHost + 'typeG',
            type: 'G',
            // price: +(+item.provPrice * ((100 + percent) / 100)).toFixed(3)
            price: +(+item.provPrice + (+item.provPrice * percent) / 100).toFixed(3)
          },
          {
            id: item.provSlug + item.provHost + 'typeP',
            type: 'P',
            // price: +(+item.provPriceBonus * ((100 + percent) / 100)).toFixed(3)
            price: +(+item.provPriceBonus + (+item.provPriceBonus * percent) / 100).toFixed(3)
          }
        ]
      }
    })
  }
  return dataReturn
}

export const calculateAutoStockG = async () => {
  const system = await defaultService.getDefaultDataByType(GETSTOCKSTYPE)
  const data = await getStockService.getProviderList(system?.dataId)

  let dataReturn: any = []
  if (data.preProvider) {
    dataReturn = data.preProvider.map((item: any) => {
      return {
        name: item.provName,
        id: item.provSlug + item.provHost + generateRandomString(3),
        stockTypes: [
          {
            id: item.provSlug + item.provHost + 'typeG',
            type: 'G',
            price: +item.provPrice
          }
          // {
          //   id: item.provSlug + item.provHost + 'typeP',
          //   type: 'P',
          //   price: +item.provPriceBonus
          // }
        ]
      }
    })
  }

  // tinh toan
  const percent = parseFloat(SERVER_CONFIG[SHOW_STOCK_KEY].percent_normal)
  dataReturn = dataReturn.map((item: any) => {
    return {
      ...item,
      stockTypes: item.stockTypes.map((stockType: any) => {
        return {
          ...stockType,
          //  price: +(stockType.price * ((100 + percent) / 100)).toFixed(3)
          price: +(+stockType.price + (+stockType.price * percent) / 100).toFixed(3)
        }
      })
    }
  })

  return dataReturn
}

export const calculateAutoStockP = async () => {
  const system = await defaultService.getDefaultDataByType(GETSTOCKSTYPE)
  const data = await getStockService.getProviderList(system?.dataId)

  let dataReturn: any = []
  if (data.norProvider) {
    dataReturn = data.norProvider.map((item: any) => {
      return {
        name: item.provName,
        id: item.provSlug + item.provHost + generateRandomString(3),
        stockTypes: [
          // {
          //   id: item.provSlug + item.provHost + 'typeG',
          //   type: 'G',
          //   price: +item.provPrice
          // },
          {
            id: item.provSlug + item.provHost + 'typeP',
            type: 'P',
            price: +item.provPriceBonus
          }
        ]
      }
    })
  }

  // tinh toan
  const percent = parseFloat(SERVER_CONFIG[SHOW_STOCK_KEY].percent_normal)
  dataReturn = dataReturn.map((item: any) => {
    return {
      ...item,
      stockTypes: item.stockTypes.map((stockType: any) => {
        return {
          ...stockType,
          // price: +((stockType.price * (100 + percent)) / 100).toFixed(3)
          price: +(+stockType.price + (+stockType.price * percent) / 100).toFixed(3)
        }
      })
    }
  })

  return dataReturn
}

export const updateAutoStockTypeG = async () => {
  const dataReturn = await calculateAutoStockG()
  await systemConfigService.changeValueByKey(AUTO_STOCK_G_KEY, JSON.stringify(dataReturn))
}

export const updateAutoStockTypeP = async () => {
  const dataReturn = await calculateAutoStockP()
  await systemConfigService.changeValueByKey(AUTO_STOCK_P_KEY, JSON.stringify(dataReturn))
}

export const getAutoStockTypeG = async () => {
  const data = await systemConfigService.findSystemDataByKey(AUTO_STOCK_G_KEY)
  if (!data) {
    // create
    const dataReturn = await calculateAutoStockG()
    await systemConfigService.createNewSystemConfig({
      key: AUTO_STOCK_G_KEY,
      value: JSON.stringify(dataReturn)
    })
    return {
      content: dataReturn,
      total: dataReturn.length
    }
  }
  const dataReturn = JSON.parse(data.value)
  return {
    content: dataReturn,
    total: dataReturn.length
  }
}

export const getAutoStockByHostAndType = async (link: string, type: PackageType) => {
  if (!link) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const domain = await getDomain(link)
  const pathName = await getPathName(link)

  let stock: any
  let stocks: any = []
  if (type == PackageType.G) {
    console.log('TYPE G AUTO')
    stocks = await getAllAutoStockNormal()
  } else {
    console.log('TYPE P AUTO')
    stocks = await getAllAutoStockPre()
  }
  for (const item of stocks) {
    if (item?.pathName) {
      if (domain.includes(item.host) && pathName.includes(item?.pathName)) {
        stock = item
        break
      }
    }
  }
  console.log('domain ', domain, pathName)
  if (!stock) {
    for (const item of stocks) {
      if (domain.includes(item.host)) {
        stock = item
        break
      }
    }

    if (!stock) {
      console.log('stock not found')
      throw new HttpException(404, LangI18n.__('stock_not_supported'))
    }
  } else if (stock) {
    if (!stock?.stockTypes.length || !stock.stockTypes?.some((stock_: any) => stock_.type === type)) {
      console.log('stock doesnot type')
      throw new HttpException(404, LangI18n.__('stock_not_supported'))
    }
  }

  console.log('auto-item after filter: ', stock)

  return stock
}

export const getAutoStockTypeP = async () => {
  const data = await systemConfigService.findSystemDataByKey(AUTO_STOCK_P_KEY)
  if (!data) {
    // create
    const dataReturn = await calculateAutoStockP()
    await systemConfigService.createNewSystemConfig({
      key: AUTO_STOCK_P_KEY,
      value: JSON.stringify(dataReturn)
    })
    return {
      content: dataReturn,
      total: dataReturn.length
    }
  }
  const dataReturn = JSON.parse(data.value)
  return {
    content: dataReturn,
    total: dataReturn.length
  }
}

export const getAllStockTypeG = async () => {
  if (!checkServerConfig(SHOW_STOCK_KEY)) {
    return await getAllActiveStockTypeG()
  }

  console.log('SHOW_STOCK_KEY ', SERVER_CONFIG[SHOW_STOCK_KEY])
  console.log('SHOW_STOCK_KEY ', SERVER_CONFIG[SHOW_STOCK_KEY].auto_nor)

  if (SERVER_CONFIG[SHOW_STOCK_KEY].auto_nor === 1) {
    return await getAutoStockTypeG()
  }

  return await getAllActiveStockTypeG()
}
export const getAllStockTypeP = async () => {
  if (!checkServerConfig(SHOW_STOCK_KEY)) {
    return await getAllActiveStockTypeG()
  }

  console.log('SHOW_STOCK_KEY ', SERVER_CONFIG[SHOW_STOCK_KEY])
  console.log('SHOW_STOCK_KEY ', SERVER_CONFIG[SHOW_STOCK_KEY].auto_nor)

  if (SERVER_CONFIG[SHOW_STOCK_KEY].auto_pre === 1) {
    return await getAutoStockTypeP()
  }

  return await getAllActiveStockTypeP()
}

export const getAllActiveStockTypeG = async () => {
  const stocks = await prisma.stock.findMany({
    where: {
      isActive: true,
      stockTypes: {
        some: {
          type: PackageType.G
        }
      }
    },
    select: {
      name: true,
      id: true,
      stockTypes: {
        where: {
          type: PackageType.G
        }
      }
    }
  })
  return {
    content: stocks,
    total: stocks.length
  }
}

export const getAllActiveStockTypeP = async () => {
  console.log('get all actice type p')
  const stocks = await prisma.stock.findMany({
    where: {
      isActive: true,
      stockTypes: {
        some: {
          type: PackageType.P
        }
      }
    },
    select: {
      name: true,
      id: true,
      stockTypes: {
        where: {
          type: PackageType.P
        }
      }
    }
  })
  return {
    content: stocks,
    total: stocks.length
  }
}

export const getAllStocks = async () => {
  const stocks = await prisma.stock.findMany({
    include: { stockTypes: true, system: { select: { id: true, name: true, host: true } } },
    orderBy: [{ updatedAt: 'desc' }]
  })
  return {
    content: stocks,
    total: stocks.length
  }
}

export const checkStockByHost = async (host: string, id: string = '') => {
  if (!host) {
    return null
  }
  const stockFind = await prisma.stock.findFirst({
    where: {
      host: host,
      id: {
        not: id
      }
    }
  })
  if (stockFind) {
    throw new HttpException(422, LangI18n.__('stock_is_exist'))
  }

  return null
}

export const createStock = async (stockInput: Stock) => {
  if (!Object.keys(stockInput).length) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  stockInput.host = await getDomain(stockInput.host)

  // await checkStockByHost(stockInput.host, '')

  const systemFind = await systemService.getSystemById(stockInput.systemId)

  if (!stockInput?.stockTypes?.length) {
    console.log('stockInput', stockInput)
    throw new HttpException(422, LangI18n.__('choose_stock_type'))
  }

  return await prisma.stock.create({
    data: {
      name: stockInput.name,
      host: stockInput.host,
      pathName: stockInput.pathName,
      systemId: stockInput.systemId,
      isActive: true,
      stockTypes: {
        create: stockInput.stockTypes
      }
    },
    include: { stockTypes: true, system: true }
  })
}

export const updateStock = async (id: string, stockInput: StockUpdateInput) => {
  const stockFind = await getStockById(id)
  const stockUpdate: any = {}
  if (stockInput.name) {
    stockUpdate.name = stockInput.name
  }
  if (stockInput.systemId) {
    stockUpdate.systemId = stockInput.systemId
  }
  if (stockInput.host) {
    stockUpdate.host = await getDomain(stockInput.host)
    // await checkStockByHost(stockUpdate.host, stockFind.id)
  }
  stockUpdate.pathName = stockInput.pathName

  let updateTypeG: any = undefined
  const idG = stockFind?.stockTypes?.length
    ? stockFind.stockTypes.find((stockType) => stockType.type === PackageType.G)?.id
    : ''

  if (stockInput.priceG > 0) {
    updateTypeG = prisma.stockType.upsert({
      where: { id: idG || 'idG' },
      update: {
        price: stockInput.priceG
      },
      create: {
        type: PackageType.G,
        price: stockInput.priceG,
        stockId: stockFind.id
      }
    })
  } else if (idG && stockInput.priceG === 0) {
    updateTypeG = prisma.stockType.delete({ where: { id: idG } })
  }

  let updateTypeP: any = undefined
  const idP = stockFind?.stockTypes?.length
    ? stockFind.stockTypes.find((stockType) => stockType.type === PackageType.P)?.id
    : ''
  if (stockInput.priceP > 0) {
    updateTypeP = prisma.stockType.upsert({
      where: { id: idP || 'idP' },
      update: { price: stockInput.priceP },
      create: {
        type: PackageType.P,
        price: stockInput.priceP,
        stockId: stockFind.id
      }
    })
  } else if (idP && stockInput.priceP === 0) {
    updateTypeP = prisma.stockType.delete({ where: { id: idP } })
  }

  const updateStockQuery = prisma.stock.update({
    where: { id: id },
    data: {
      ...stockUpdate
    },
    include: { stockTypes: true }
  })

  const promiseQueries: any = [updateStockQuery]
  if (updateTypeG) promiseQueries.unshift(updateTypeG)
  if (updateTypeP) promiseQueries.unshift(updateTypeP)

  const result = await prisma.$transaction(promiseQueries)
  return result[result?.length - 1]
}

export const deleteStocks = async (id: string) => {
  const stockFind = await getStockById(id)
  return await prisma.stock.delete({
    where: { id: id }
  })
}

export const changeStockStatus = async (id: string) => {
  const stockFind = await getStockById(id)
  return await prisma.stock.update({
    where: { id: id },
    data: { isActive: !stockFind.isActive }
  })
}

const getStockByHost = async (link: string) => {
  if (!link) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const domain = await getDomain(link)

  const stock = await prisma.stock.findFirst({
    where: { host: { startsWith: domain }, isActive: true },
    include: { stockTypes: true, system: true }
  })

  if (!stock) {
    throw new HttpException(404, LangI18n.__('stock_not_found'))
  }
  return stock
}

const getStockByHostAndType = async (link: string, type: PackageType) => {
  if (!link) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const domain = await getDomain(link)
  const pathName = await getPathName(link)

  const stocks = await prisma.stock.findMany({
    where: { host: { startsWith: domain }, isActive: true },
    include: {
      stockTypes: {
        where: { type: type }
      },
      system: true
    }
  })

  if (!stocks) {
    throw new HttpException(404, LangI18n.__('stock_not_supported'))
  }

  console.log('link', link, type)
  console.log('domain', domain)
  console.log('stocks ', type, pathName, stocks)
  let stock
  for (const item of stocks) {
    if (item?.pathName) {
      if (domain.includes(item.host) && pathName.includes(item?.pathName)) {
        stock = item
        break
      }
    }
  }
  if (!stock) {
    for (const item of stocks) {
      if (domain.includes(item.host)) {
        stock = item
        break
      }
    }

    if (!stock) {
      console.log('stock not found')
      throw new HttpException(404, LangI18n.__('stock_not_supported'))
    }
  } else if (stock) {
    if (!stock?.stockTypes.length || !stock.stockTypes?.some((stock_: any) => stock_.type === type)) {
      console.log('stock doesnot type')
      throw new HttpException(404, LangI18n.__('stock_not_supported'))
    }
  }

  console.log('item after filter: ', stock)

  return stock
}

export default {
  getStockById,
  getAllActiveStockTypeG,
  getAllActiveStockTypeP,
  getStockByHostAndType,
  getStockByHost,
  getAllActiveStocks,
  getAllStocks,
  createStock,
  updateStock,
  deleteStocks,
  changeStockStatus,
  getAutoStockTypeG,
  getAutoStockTypeP,
  getAllStockTypeG,
  getAllStockTypeP,
  updateAutoStockTypeG,
  updateAutoStockTypeP,
  calculateAutoStockG,
  getAutoStockByHostAndType
}
