import { Request, Response, NextFunction } from 'express'
import { getStockService } from '../services/thirdService'
import { STATUS_CODE, successReponse } from './controller'
import gsItemService from '../services/gs-item.service'

export const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getStockService.getAccessToken(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getStockService.getProfile(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getProviderList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getStockService.getProviderList(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOrdersList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getStockService.getOrdersList(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getStockService.getBalance(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getItemInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = 'get item info'
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getLinkDownLoad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = 'get link download'
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const checkDownLoadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = 'get link download'
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gsItemService.updateStatus(req.body.id, req.body.status)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  getItemInfo,
  checkDownLoadStatus,
  getLinkDownLoad,
  getProfile,
  getProviderList,
  getAccessToken,
  getOrdersList,
  getBalance,
  updateStatus
}
