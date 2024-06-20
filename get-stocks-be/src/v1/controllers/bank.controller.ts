import { Request, Response, NextFunction } from 'express'
import bankService from '../services/bank.service'
import { bankValidate } from '../validations/bank.validation'
import { validateData } from '../utils/validateData'
import { STATUS_CODE, successReponse } from './controller'
import botsmsService from '../services/bank/botsms.service'
import abcBank from '../services/bank/api-acb'
import orderHistoryService from '../services/orderHistory.service'

export const createBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(bankValidate.create, req.body, res)
    const result = await bankService.createBank(req.body)
    return successReponse(STATUS_CODE.CREATED, result, res)
  } catch (error) {
    next(error)
  }
}

export const getTransactionHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const result = await botsmsService.getTransactionHistory()
    // const result = await abcBank.getTransactionPayment()
    const result = await orderHistoryService.checkPaymentContinuous({
      id: '14ca394e-9603-4073-b903-499a3f6ad096'
    })
    successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getBankById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bankService.getBankById(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllBanks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bankService.getAllBanks()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllActiveBanks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bankService.getAllActiveBanks()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bankService.updateBank(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const deleteBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bankService.deleteBank(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeBankStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bankService.changeBankStatus(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  getAllActiveBanks,
  getTransactionHistory,
  createBank,
  getAllBanks,
  deleteBank,
  updateBank,
  getBankById,
  changeBankStatus
}
