import { Request, Response, NextFunction } from 'express'
import momoService from '../services/momo.service'
import { STATUS_CODE, successReponse } from './controller'

export const createMomo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await momoService.createMomo(req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getMomoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await momoService.getMomoById(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getMomoActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await momoService.getMomoActive()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllMomo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await momoService.getAllMomo()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateMomo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await momoService.updateMomo(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const deleteMomo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await momoService.deleteMomo(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeMomoStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await momoService.changeMomoStatus(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default { getMomoActive, createMomo, getAllMomo, deleteMomo, updateMomo, changeMomoStatus, getMomoById }
