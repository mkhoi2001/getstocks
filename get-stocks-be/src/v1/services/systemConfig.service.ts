import HttpException from '../errors/httpException'
import { prisma } from 'prisma/prisma-client'
import { GETSTOCKSTYPE, GET_STOCK_PROV, LangI18n, SHOW_STOCK_KEY } from '../../v1/utils/const'
import { StockConfig, SystemConfig } from '../models/config.model'
import { updateServerConfig } from '../utils/utilFuncs'
import gsItemService from './gs-item.service'

export const getEmailConfig = async () => {
  const emailAppPromise = prisma.systemConfig.findFirst({ where: { key: 'email_app' } })
  const appNamePromise = prisma.systemConfig.findFirst({ where: { key: 'app_name' } })
  const emailHostPromise = prisma.systemConfig.findFirst({ where: { key: 'email_host' } })
  const emailPortPromise = prisma.systemConfig.findFirst({ where: { key: 'email_port' } })
  const emailPassPromise = prisma.systemConfig.findFirst({ where: { key: 'email_password' } })

  const [emailApp, appName, emailHost, emailPort, emailPass] = await Promise.all([
    emailAppPromise,
    appNamePromise,
    emailHostPromise,
    emailPortPromise,
    emailPassPromise
  ])

  return {
    emailSender: emailApp?.value,
    appName: appName?.value,
    emailPass: emailPass?.value,
    emailHost: emailHost?.value,
    emailPort: emailPort?.value
  }
}

export const getAllSystemConfig = async () => {
  const data = await prisma.systemConfig.findMany({ select: { id: true, key: true, value: true } })

  return {
    data,
    total: data.length
  }
}

export const getConfigClient = async () => {
  const clientKeys = [
    'guide_box',
    'usd_vnd',
    'footer',
    'ul',
    'facebook',
    'zalo',
    'app_name',
    'botsms_content',
    'banner',
    'client_id_paypal',
    'show_paypal',
    'show_stock'
  ]
  const data = await prisma.systemConfig.findMany({ select: { key: true, value: true } })
  const dataClient = clientKeys.map((item) => {
    return data.find((itemData: { key: string; value: string }) => itemData.key === item)
  })

  return dataClient
}

export const getConfigAdmin = async () => {
  const adminKeys = [
    'guide_box',
    'usd_vnd',
    'footer',
    'ul',
    'facebook',
    'zalo',
    'app_name',
    'botsms_content',
    'banner',
    'client_id_paypal',
    'show_paypal',
    'email_port',
    'email_host',
    'email_app',
    'email_password',
    'app_name'
  ]
  const data = await prisma.systemConfig.findMany({ select: { key: true, value: true } })
  const dataAdmin = adminKeys.map((item) => {
    return data.find((itemData: { key: string; value: string }) => itemData.key === item)
  })

  return dataAdmin
}

export const getsytemDataById = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const data = await prisma.systemConfig.findUnique({ where: { id: id } })
  if (!data) {
    throw new HttpException(404, LangI18n.__('data_not_found'))
  }
  return data
}

export const findSystemDataByKey = async (key: string = '') => {
  if (!key) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const data = await prisma.systemConfig.findFirst({ where: { key } })

  return data
}

export const getSystemDataByKey = async (key: string = '') => {
  if (!key) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const data = await prisma.systemConfig.findFirst({ where: { key } })
  if (!data) {
    throw new HttpException(404, LangI18n.__('data_not_found'))
  }
  return data
}

export const changeValueById = async (id: string = '', value: string = '') => {
  if (!id || !value) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const data = await prisma.systemConfig.update({
    where: { id },
    data: {
      value
    }
  })

  return data
}

export const changeValueByKey = async (key: string = '', value: string = '') => {
  if (!key || !value) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const data = await prisma.systemConfig.upsert({
    where: {
      key: key
    },
    update: {
      value
    },
    create: {
      key,
      value
    }
  })

  return data
}

export const updateShowStockKey = async (data: StockConfig) => {
  if (!data) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const dataUpdate = JSON.stringify(data, null, '\t')
  // console.log('dataUpdate: ', dataUpdate)

  return prisma.systemConfig.update({
    where: { key: SHOW_STOCK_KEY },
    data: { value: dataUpdate },
    select: {
      id: true,
      key: true,
      value: true
    }
  })
}

export const updateGetStockProv = async (data: any) => {
  if (!data) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const dataUpdate = JSON.stringify(data, null, '\t')
  // console.log('dataUpdate: ', dataUpdate)

  await prisma.systemConfig.update({
    where: { key: GET_STOCK_PROV },
    data: { value: dataUpdate },
    select: {
      id: true,
      key: true,
      value: true
    }
  })

  return await gsItemService.updateItems()
}

export const changeMultipleValue = async (data: SystemConfig[]) => {
  if (!data.length) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const updatePromise = data.map((item: SystemConfig) => {
    if (item.key == SHOW_STOCK_KEY) {
      updateServerConfig(SHOW_STOCK_KEY, item.value)
    }

    return prisma.systemConfig.update({
      where: { id: item.id },
      data: { value: item.value },
      select: {
        id: true,
        key: true,
        value: true
      }
    })
  })

  const updateData = await prisma.$transaction(updatePromise)
  return updateData
}

export const createNewSystemConfig = async ({ key, value }: { key: string; value: string }) => {
  if (!key || !value) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const dataFind = await prisma.systemConfig.findFirst({ where: { key } })
  if (dataFind) {
    throw new HttpException(400, LangI18n.__('data_is_exists'))
  }

  return await prisma.systemConfig.create({
    data: { key, value }
  })
}

export const deleteSystemConfig = async (id: string = '') => {
  const dataFind = await getSystemDataByKey(id)
  return await prisma.systemConfig.delete({ where: { id } })
}

export default {
  getAllSystemConfig,
  changeValueById,
  getsytemDataById,
  getSystemDataByKey,
  createNewSystemConfig,
  deleteSystemConfig,
  getConfigClient,
  changeMultipleValue,
  getEmailConfig,
  changeValueByKey,
  findSystemDataByKey,
  getConfigAdmin,
  updateShowStockKey,
  updateGetStockProv
}
