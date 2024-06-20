import { PackagePricingG, PackagePricingP, PackageOrder } from '../models/package.model'
import { prisma } from '../../../prisma/prisma-client'
import HttpException from '../errors/httpException'
import { LangI18n } from '../../v1/utils/const'

export const getPackagePricingGById = async (id: string) => {
  const packageFind = await prisma.packagePricingG.findUnique({ where: { id: id } })
  if (!packageFind) {
    throw new HttpException(404, LangI18n.__('package_not_found'))
  }
  return packageFind
}
export const getPackagePricingPById = async (id: string) => {
  const packageFind = await prisma.packagePricingP.findUnique({ where: { id: id } })
  if (!packageFind) {
    throw new HttpException(404, LangI18n.__('package_not_found'))
  }
  return packageFind
}

export const createPackagePricingG = async (packageGInput: PackagePricingG) => {
  return await prisma.packagePricingG.create({
    data: packageGInput
    // data: {
    //   name: packageGInput.name,
    //   balanceG: packageGInput.balanceG,
    //   balanceP: packageGInput.balanceP,
    //   price: packageGInput.price,
    //   content: packageGInput.content
    // }
  })
}

export const createPackagePricingP = async (packagePInput: PackagePricingP) => {
  return await prisma.packagePricingP.create({
    data: packagePInput
  })
}

export const getAllPackagePricingG = async () => {
  const packages = await prisma.packagePricingG.findMany({ orderBy: { updatedAt: 'desc' } })
  return {
    content: packages,
    total: packages.length
  }
}
export const getAllPackagePricingP = async () => {
  const packages = await prisma.packagePricingP.findMany({ orderBy: { updatedAt: 'desc' } })
  return {
    content: packages,
    total: packages.length
  }
}

export const updatePackagePricingG = async (id: string, packageGInput: PackagePricingG) => {
  const packageFind = await getPackagePricingGById(id)
  return await prisma.packagePricingG.update({
    where: { id },
    data: packageGInput
  })
}
export const updatePackagePricingP = async (id: string, packagePInput: PackagePricingP) => {
  const packageFind = await getPackagePricingPById(id)
  return await prisma.packagePricingP.update({
    where: { id },
    data: packagePInput
  })
}

export const deletePackagePricingG = async (id: string) => {
  const packageFind = await getPackagePricingGById(id)
  return await prisma.packagePricingG.delete({
    where: { id }
  })
}
export const deletePackagePricingP = async (id: string) => {
  const packageFind = await getPackagePricingPById(id)
  return await prisma.packagePricingP.delete({
    where: { id }
  })
}

export default {
  createPackagePricingG,
  createPackagePricingP,
  getAllPackagePricingG,
  getAllPackagePricingP,
  deletePackagePricingP,
  deletePackagePricingG,
  getPackagePricingGById,
  getPackagePricingPById,
  updatePackagePricingG,
  updatePackagePricingP
}
