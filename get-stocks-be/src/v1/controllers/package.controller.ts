import packageService from '../services/package.service'
import { Request, Response, NextFunction } from 'express'
import { STATUS_CODE, successReponse } from './controller'

export const getPackagePricingGById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.getPackagePricingGById(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getPackagePricingPById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.getPackagePricingPById(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const createPackagePricingG = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.createPackagePricingG(req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const createPackagePricingP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.createPackagePricingP(req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllPackagePricingG = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.getAllPackagePricingG()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}
export const getAllPackagePricingP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.getAllPackagePricingP()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updatePackagePricingG = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.updatePackagePricingG(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}
export const updatePackagePricingP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.updatePackagePricingP(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const deletePackagePricingG = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.deletePackagePricingG(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}
export const deletePackagePricingP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageService.deletePackagePricingP(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
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
