import { Prisma } from '@prisma/client'
import HttpException from '../errors/httpException'
import { prisma } from 'prisma/prisma-client'
import { LangI18n } from '../../v1/utils/const'

export const getDefaultDataById = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const data = await prisma.defaultData.findUnique({ where: { id: id } })
  if (!data) {
    throw new HttpException(404, LangI18n.__('data_not_found'))
  }
  return data
}

export const getDefaultDataByType = async (type: string = '') => {
  if (!type) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const data = await prisma.defaultData.findFirst({ where: { type } })
  if (!data) {
    throw new HttpException(404, LangI18n.__('data_not_found'))
  }
  return data
}

export default { getDefaultDataById, getDefaultDataByType }
