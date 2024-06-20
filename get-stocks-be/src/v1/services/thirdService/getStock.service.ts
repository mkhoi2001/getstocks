import axios from 'axios'
import System from '../../models/system.model'
import systemService from '../system.service'
import jwtUtil from '../../utils/jwt.util'
import HttpException from '../../errors/httpException'
import ItemHistory from '../../models/itemHistory.model'
import { LangI18n } from '../../../v1/utils/const'
import cryptoUtil from '../../../v1/utils/crypto.util'
import { prisma } from 'prisma/prisma-client'

const getStockHost = {
  defaultHost: 'https://getstocks.net/api',
  downloadHost: 'https://getstocks.net/api/v1/download'
}

export const listAPI = {
  getAccessToken: `/auth/login`,
  getProfile: `/auth/profile`,
  getProviderList: `/v1/providers`,
  getOrdersList: `/v1/orders`,
  getBalance: `/v1/balance`,
  getItemInfo: `/v1/getinfo`,
  getLinkDownload: `/v1/getlink`,
  checkDownloadStatus: `/v1/download-status`
}

export const getAccessToken = async (systemId: string = '') => {
  // const url = new URL(defaultHost)
  // const system = await systemService.getSystemByHost(url.origin)
  const system = await systemService.getSystemById(systemId)
  // const dataPass = await jwtUtil.verifyTokenPassword(system.password)
  const dataPass = await cryptoUtil.decrypt(system.password)
  system.password = dataPass

  const result = await axios.post(`${system.host}${listAPI.getAccessToken}`, {
    email: system.email,
    password: system.password
  })

  system.token = result.data?.result?.access_token
  // return await systemService.updateSystem(system.id, system)
  return await updateThirdParty(system.id, { token: system.token, balance: null })
}

const updateThirdParty = async (id: string, data: { token: string | null; balance: number | null }) => {
  if (!Object.keys(data).length || !id) {
    return null
  }

  const dataUpdate: any = {}
  if (data?.balance) {
    dataUpdate.balance = data?.balance
  }
  if (data?.token) {
    dataUpdate.token = data?.token
  }

  return await prisma.system.update({
    where: { id },
    data: dataUpdate,
    select: {
      password: false,
      id: true,
      name: true,
      enable: true,
      host: true,
      email: true,
      username: true,
      token: true,
      refreshToken: true,
      balance: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export const getProfile = async (systemId: string = '') => {
  // const url = new URL(defaultHost)
  // const system = await systemService.getSystemByHost(url.origin)

  const system = await systemService.getSystemById(systemId)
  const result = await axios.get(`${system.host}${listAPI.getProfile}?token=${system.token}`)
  if (result.data?.result) {
    return result.data?.result
  }
  return result.data
}

export const getProviderList = async (systemId: string = '') => {
  // const url = new URL(defaultHost)
  // const system = await systemService.getSystemByHost(url.origin)

  const system = await systemService.getSystemById(systemId)
  const result = await axios.get(`${system.host}${listAPI.getProviderList}?token=${system.token}`)
  if (result.data?.result) {
    return result.data?.result
  }
  return result.data
}

export const getOrdersList = async (systemId: string = '') => {
  // const url = new URL(defaultHost)
  // const system = await systemService.getSystemByHost(url.origin)

  const system = await systemService.getSystemById(systemId)
  const result = await axios.get(`${system.host}${listAPI.getOrdersList}?token=${system.token}`)
  if (result.data?.result) {
    return result.data?.result
  }
  return result.data
}

export const getBalance = async (systemId: string = '') => {
  // const url = new URL(defaultHost)
  // const system = await systemService.getSystemByHost(url.origin)

  const system = await systemService.getSystemById(systemId)
  const result = await axios.get(`${system.host}${listAPI.getBalance}?token=${system.token}`)
  if (result.data?.result) {
    return result.data?.result
  }
  system.balance = parseFloat(result.data?.bValue)
  // return await systemService.updateSystem(system.id, system)
  return await updateThirdParty(system.id, { token: null, balance: system.balance })
}

export const getItemInfo = async (system?: System, link: string = '', ispre: number = 1) => {
  if (!link || !system) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  // const url = new URL(defaultHost)
  // const system = await systemService.getSystemByHost(url.origin)

  // const system = await systemService.getSystemById(systemId)
  const body: { link: string; ispre: number } = { link, ispre }

  const result = await axios.post(`${system.host}${listAPI.getItemInfo}?token=${system.token}`, body)
  // if (result.data?.result) {
  //   return result.data?.result
  // }
  return result.data
}

export const getLinkDownload = async (system?: System, link: string = '', ispre: number = 1, type: string = '') => {
  if (!link || !system) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  // const system = await systemService.getSystemById(systemId)
  const body: { link: string; ispre: number; type: string } = { link, ispre, type }

  const result = await axios.post(`${system.host}${listAPI.getLinkDownload}?token=${system.token}`, body)
  console.log('getLinkDownload ', result.data)
  if (result.data?.title.includes('Low balance')) {
    throw new HttpException(400, LangI18n.__('item_download_failed'))
  }
  // if (result.data?.result) {
  //   return result.data?.result
  // }
  return result.data
}

const reCheckStatus = async (system: System, body: any) => {
  const result = await axios.post(`${system.host}${listAPI.checkDownloadStatus}?token=${system.token}`, body)
  if (result?.data?.result.status === 1) {
    return result.data
  }
  return null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const checkDownloadStatus = async (
  system?: System,
  slug: string | null = '',
  id: string | null = '',
  ispre: number | null = 1,
  type: string | null = ''
) => {
  if (!slug || !id || !system) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  // const system = await systemService.getSystemById(systemId)
  const body: { slug: string; id: string; ispre: number | null; type: string | null } = { slug, id, ispre, type }
  let result = await axios.post(`${system.host}${listAPI.checkDownloadStatus}?token=${system.token}`, body)
  if (result?.data?.result.status !== 1) {
    for (let i = 1; i <= 20; i++) {
      await sleep(3000)
      result = await axios.post(`${system.host}${listAPI.checkDownloadStatus}?token=${system.token}`, body)
      if (result?.data?.result?.status === 1) {
        return result.data
      }
      console.log('i call: ', i, 'status: ', result?.data?.result?.status)
      console.log('result: ', result?.data)
    }
  }
  // if (result.data?.result) {
  //   return result.data?.result
  // }
  return result.data
}

export const downloadItem = async (itemHistory: ItemHistory) => {
  const linkDown = `${getStockHost.downloadHost}/${itemHistory.itemDCode}?token=${itemHistory?.system?.token}`

  const response = await axios.get(linkDown, { responseType: 'stream' })
  return response
}

export const generateLinkDownload = async (system: System, itemDCode: string) => {
  if (!itemDCode || !system) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const linkDown = `${getStockHost.downloadHost}/${itemDCode}?token=${system.token}`
  return linkDown
}

export default {
  generateLinkDownload,
  getAccessToken,
  getProfile,
  getProviderList,
  getOrdersList,
  getBalance,
  getItemInfo,
  getLinkDownload,
  checkDownloadStatus,
  downloadItem
}
