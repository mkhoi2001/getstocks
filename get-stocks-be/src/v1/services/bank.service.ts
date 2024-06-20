import { prisma } from '../../../prisma/prisma-client'
import HttpException from '../errors/httpException'
import { Bank } from '../models/bank.model'
import { LangI18n } from '../../v1/utils/const'

export const getBankById = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const bank = await prisma.bank.findUnique({ where: { id: id } })
  if (!bank) {
    throw new HttpException(404, LangI18n.__('bank_not_found'))
  }
  return bank
}

export const getAllBanks = async () => {
  const banks = await prisma.bank.findMany({ orderBy: { updatedAt: 'desc' } })
  return {
    content: banks,
    total: banks.length
  }
}

export const getAllActiveBanks = async () => {
  const banks = await prisma.bank.findMany({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } })
  return {
    content: banks,
    total: banks.length
  }
}

export const createBank = async (bankInput: Bank) => {
  return await prisma.bank.create({
    data: bankInput
  })
}

export const updateBank = async (id: string, bankInput: Bank) => {
  const bankFind = await getBankById(id)

  if (bankInput.username) bankFind.username = bankInput.username
  if (bankInput.cardNumber) bankFind.cardNumber = bankInput.cardNumber
  if (bankInput.bankName) bankFind.bankName = bankInput.bankName
  if (bankInput.host) bankFind.host = bankInput.host
  if (bankInput.bankcode) bankFind.bankcode = bankInput.bankcode

  const bank = await prisma.bank.update({
    where: { id: bankFind.id },
    data: bankInput
  })
  return bank
}

export const deleteBank = async (id: string = '') => {
  const bankFind = await getBankById(id)
  return await prisma.bank.delete({ where: { id: id } })
}

export const changeBankStatus = async (id: string = '') => {
  const bankFind = await getBankById(id)
  return await prisma.bank.update({ where: { id: id }, data: { isActive: !bankFind.isActive } })
}

export default { getAllActiveBanks, createBank, getAllBanks, deleteBank, updateBank, getBankById, changeBankStatus }
