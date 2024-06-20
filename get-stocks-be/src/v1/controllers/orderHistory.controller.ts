import { Request, Response, NextFunction } from 'express'
import { STATUS_CODE, successReponse } from './controller'
import orderHistoryService from '../services/orderHistory.service'

export const callbackHistoryBotsms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.callbackHistoryBotsms(req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllOrderHistoryByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id || ''
    const result = await orderHistoryService.getAllOrderHistoryByUserId(id as string)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllOrderHistoryOwn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.getAllOrderHistoryByUserId(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.getAllOrderHistory()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getPackageOrderByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.getPackageOrderByUserId(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const createOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.createOrderHistory(req?.user?.id, req.body)
    successReponse(STATUS_CODE.OK, result, res)
    await orderHistoryService.checkPaymentContinuous(result)
  } catch (error) {
    next(error)
  }
}

export const orderSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.orderSuccess(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const orderFail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.orderFail(req?.params?.id, req.body?.reason)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const createOrderByPaypal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.createOrderByPaypal(req?.user?.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOrderByApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderHistoryService.getOrderByApiKey(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  getOrderByApiKey,
  getAllOrderHistoryOwn,
  createOrderByPaypal,
  getAllOrderHistory,
  callbackHistoryBotsms,
  getPackageOrderByUserId,
  getAllOrderHistoryByUserId,
  createOrderHistory,
  orderSuccess,
  orderFail
}
