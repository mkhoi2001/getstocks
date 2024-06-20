import { Request, Response, NextFunction } from 'express'
import dashboardService from '../services/dashboard.service'
import { STATUS_CODE, successReponse } from './controller'

export const getOverviewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getOverviewUser()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOverviewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getOverviewOrder()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOverviewItemDownload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getOverviewItemDownload()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllOrverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getAllOrverview()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getUsersByMonthAndYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getUsersByMonthAndYear(+req.params.year)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getItemsByMonthAndYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getItemsByMonthAndYear(+req.params.year)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOrdersByMonthAndYear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getOrdersByMonthAndYear(+req.params.year)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getUsersByDailyWeek = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getUsersByDailyWeek()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getUsersByFilterDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getUsersByFilterDate(req.query.from, req.query.to)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getItemsByFilterDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getItemsByFilterDate(req.query.from, req.query.to)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOrdersByFilterDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getOrdersByFilterDate(req.query.from, req.query.to)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getNewsOrderHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getNewsOrderHistory()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getNewsItemHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getNewsItemHistory()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getNewsOrderHistoryOwn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getNewsOrderHistoryOwn(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getNewsItemHistoryOwn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await dashboardService.getNewsItemHistoryOwn(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  getUsersByDailyWeek,
  getNewsItemHistory,
  getNewsOrderHistory,
  getItemsByFilterDate,
  getUsersByFilterDate,
  getOrdersByFilterDate,
  getOrdersByMonthAndYear,
  getItemsByMonthAndYear,
  getAllOrverview,
  getOverviewUser,
  getOverviewOrder,
  getOverviewItemDownload,
  getUsersByMonthAndYear,
  getNewsOrderHistoryOwn,
  getNewsItemHistoryOwn
}
