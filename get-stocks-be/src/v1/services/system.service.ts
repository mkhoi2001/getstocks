import System, { SystemProperty } from '../models/system.model'
import { PrismaClient } from '@prisma/client'
import { prisma } from '../../../prisma/prisma-client'

import HttpException from '../errors/httpException'
import bcrypt from 'bcryptjs'
import { excludeField } from '../utils/excludeField'
import jwtUtil, { verifyTokenPassword } from '../utils/jwt.util'
const salt: string = bcrypt.genSaltSync(10)
import { LangI18n } from '../../v1/utils/const'
import getStockService from './thirdService/getStock.service'
import cryptoUtil from '../utils/crypto.util'

export const getGetstockBalance = async () => {
  const systemInfo = await prisma.defaultData.findFirst({
    where: {
      type: 'getstocks'
    }
  })

  if (!systemInfo) {
    return null
  }

  const balanceInfo = await getStockService.getBalance(systemInfo.dataId)
  return { balance: balanceInfo?.balance || 0 }
}

const getSystemById = async (id: string) => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const system = await prisma.system.findUnique({ where: { id: id }, include: { systemProperties: true } })
  if (!system) {
    throw new HttpException(404, LangI18n.__('service_not_found'))
  }
  // return excludeField<System, keyof System>(system as System, ['password']) as System
  return system
}

export const getSystemByIdWithoutPass = async (id: string) => {
  const system = await getSystemById(id)
  return excludeField<System, keyof System>(system as System, ['password']) as System
}

const getAllSystems = async () => {
  const systems = await prisma.system.findMany({
    select: {
      id: true,
      name: true,
      host: true,
      username: true,
      email: true,
      enable: true,
      token: true,
      createdAt: true,
      updatedAt: true,
      systemProperties: true
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: systems,
    total: systems.length
  }
}

const createSystem = async (systemInput: System) => {
  const systemFind = await prisma.system.findFirst({
    where: { host: systemInput.host }
  })

  if (systemFind) {
    throw new HttpException(422, 'Dịch vụ đã tồn tại')
  }

  // const hashedPassword = await bcrypt.hash(systemInput.password, salt)
  // systemInput.password = hashedPassword

  if (systemInput.password) {
    const hashedPassword = await cryptoUtil.encrypt(systemInput.password)
    // const hashedPassword = await jwtUtil.generateTokenPassword({ password: systemInput.password })
    systemInput.password = hashedPassword
  }

  const newSystem = await prisma.system.create({
    data: {
      ...systemInput,
      systemProperties: {
        create: systemInput.systemProperties
      }
    }
  })

  return excludeField<System, keyof System>(newSystem as System, ['password']) as System
}
const updateSystem = async (id: string, systemInput: System) => {
  const systemFind = await getSystemById(id)
  const dataUpdate: any = {}
  if (systemInput.name && systemInput.name !== systemFind.name) dataUpdate['name'] = systemInput.name
  if (systemInput.enable && systemInput.enable !== systemFind.enable) dataUpdate['enable'] = systemInput.enable
  // if (systemInput.host && systemInput.host !== systemFind.host) dataUpdate['host'] = systemInput.host
  if (systemInput.email && systemInput.email !== systemFind.email) dataUpdate['email'] = systemInput.email
  if (systemInput.username && systemInput.username !== systemFind.username)
    dataUpdate['username'] = systemInput.username
  if (systemInput.token && systemInput.token !== systemFind.token) dataUpdate['token'] = systemInput.token
  if (systemInput.balance && systemInput.balance !== systemFind.balance) dataUpdate['balance'] = systemInput.balance

  if (systemInput.password) {
    if (systemInput.password !== systemFind.password) {
      const oldPass = await cryptoUtil.decrypt(systemFind.password)
      if (oldPass != systemInput.password) {
        const hashedPassword = await cryptoUtil.encrypt(systemInput.password)
        dataUpdate['password'] = hashedPassword
        // systemInput.password = hashedPassword
      }
    }
  }

  const systemUpdateQuery = prisma.system.update({
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

  let sytemPropertiesUpdateQuery: any = undefined
  if (systemInput?.systemProperties?.length) {
    sytemPropertiesUpdateQuery = systemInput.systemProperties.map((property) =>
      prisma.systemProperty.update({
        where: { id: property.id },
        data: property
      })
    )
  }

  const updateArray = []
  if (sytemPropertiesUpdateQuery) {
    updateArray.push(sytemPropertiesUpdateQuery)
  }
  updateArray.push(systemUpdateQuery)
  const result = await prisma.$transaction(updateArray)
  console.log('result ', result)
  // delete result[0].password
  return result[0]
  // return excludeField<System, keyof System>(system as System, ['password']) as System
}
const changeSystemSatus = async (id: string) => {
  const systemFind = await getSystemById(id)
  const system = await prisma.system.update({
    where: { id: systemFind.id },
    data: { enable: !systemFind.enable }
  })
  return excludeField<System, keyof System>(system as System, ['password']) as System
}

export const getSystemByHost = async (host: string) => {
  if (!host) {
    throw new HttpException(422, 'Missing paramter!!!')
  }
  const system = await prisma.system.findFirst({
    where: { host: { startsWith: host } }
  })

  if (!system) {
    throw new HttpException(404, LangI18n.__('service_not_found'))
  }
  return system
}

export default {
  getSystemById,
  getSystemByIdWithoutPass,
  getSystemByHost,
  getAllSystems,
  createSystem,
  updateSystem,
  changeSystemSatus,
  getGetstockBalance
}
