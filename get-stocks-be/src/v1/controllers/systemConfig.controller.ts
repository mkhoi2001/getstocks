import { Request, Response, NextFunction } from 'express'
import { STATUS_CODE, successReponse } from './controller'
import systemConfigService from '../services/systemConfig.service'
import stockService from '../services/stock.service'
import { updateServerConfig } from '../utils/utilFuncs'
import { SERVER_CONFIG, SHOW_STOCK_KEY } from '../utils/const'
import gsItemService from '../services/gs-item.service'

export const changeValueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.changeValueById(req.params.id, req.body.value)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeValueByKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.changeValueByKey(req.body.id, req.body.value)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllSystemConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.getAllSystemConfig()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getConfigClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.getConfigClient()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getConfigAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.getConfigAdmin()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getSystemDataByKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.getSystemDataByKey((req.query.key as string) || '')
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeMultipleValue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.changeMultipleValue(req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateShowStockKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.updateShowStockKey(req.body)
    successReponse(STATUS_CODE.OK, result, res)
    updateServerConfig(SHOW_STOCK_KEY, JSON.parse(result.value))
    stockService.updateAutoStockTypeG()
    stockService.updateAutoStockTypeP()
  } catch (error) {
    next(error)
  }
}

export const updateGetStockProv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemConfigService.updateGetStockProv(req.body)
    successReponse(STATUS_CODE.OK, result, res)
    gsItemService.autoUpdateItems()
  } catch (error) {
    next(error)
  }
}

// export const updateValueObj = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const result = await systemConfigService.updateValueObj(req.body)
//     successReponse(STATUS_CODE.OK, result, res)
//   } catch (error) {
//     next(error)
//   }
// }

export default {
  getConfigClient,
  getConfigAdmin,
  changeValueById,
  changeValueByKey,
  getAllSystemConfig,
  changeMultipleValue,
  getSystemDataByKey,
  updateShowStockKey,
  updateGetStockProv
}
