import stockService from '../services/stock.service'
import { Request, Response, NextFunction } from 'express'
import { STATUS_CODE, successReponse } from './controller'
import gsItemService from '../services/gs-item.service'

export const getStockById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.getStockById(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.getAllStocks()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllStockTypeG = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const result = await stockService.getAllStockTypeG()
    const result = await gsItemService.getAllStockNormal()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllStockTypeP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const result = await stockService.getAllStockTypeP()
    const result = await gsItemService.getAllStockPremium()

    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllActiveStockTypeG = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.getAllActiveStockTypeG()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllActiveStockTypeP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.getAllActiveStockTypeP()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllActiveStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.getAllActiveStocks()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const createStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.createStock(req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.updateStock(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const deleteStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.deleteStocks(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeStockStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await stockService.changeStockStatus(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllGetStockItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gsItemService.getAllStocks()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateGetStockItemStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gsItemService.updateStatus(req.body.id, req.body.status)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getStockProviderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gsItemService.getStock(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeTypePackProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gsItemService.changeTypePackProvider(req.body.id, req.body.typePack)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  getStockById,
  getAllActiveStockTypeG,
  getAllStocks,
  getAllActiveStocks,
  createStock,
  updateStock,
  deleteStocks,
  changeStockStatus,
  getAllActiveStockTypeP,
  getAllStockTypeG,
  getAllStockTypeP,
  getAllGetStockItems,
  updateGetStockItemStatus,
  getStockProviderById,
  changeTypePackProvider
}
