import { Momo } from './../models/momo.model'
import { prisma } from '../../../prisma/prisma-client'
import { LangI18n } from '../../v1/utils/const'
import HttpException from '../errors/httpException'

export const getMomoById = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const momo = await prisma.momo.findUnique({ where: { id: id } })
  if (!momo) {
    throw new HttpException(404, LangI18n.__('momo_not_found'))
  }
  return momo
}

export const getMomoActive = async () => {
  const momos = await prisma.momo.findMany({ where: { isActive: true } })
  // if (!momos) {
  //   throw new HttpException(404, LangI18n.__('momo_not_found'))
  // }
  return {
    content: momos,
    total: momos.length
  }
}

export const getAllMomo = async () => {
  const momos = await prisma.momo.findMany({ orderBy: { updatedAt: 'desc' } })
  return {
    content: momos,
    total: momos.length
  }
}

export const createMomo = async (momoInput: Momo) => {
  return await prisma.momo.create({
    data: momoInput
  })
}

export const updateMomo = async (id: string, momoInput: Momo) => {
  const momoFind = await getMomoById(id)

  if (momoInput.username) momoFind.username = momoInput.username
  if (momoInput.phone) momoFind.phone = momoInput.phone

  const momo = await prisma.momo.update({
    where: { id: momoFind.id },
    data: momoFind
  })
  return momo
}

export const deleteMomo = async (id: string = '') => {
  const momoFind = await getMomoById(id)
  return await prisma.momo.delete({ where: { id: id } })
}

export const changeMomoStatus = async (id: string = '') => {
  const momoFind = await getMomoById(id)
  return await prisma.momo.update({ where: { id: id }, data: { isActive: !momoFind.isActive } })
}

export default { createMomo, getAllMomo, deleteMomo, updateMomo, changeMomoStatus, getMomoById, getMomoActive }
