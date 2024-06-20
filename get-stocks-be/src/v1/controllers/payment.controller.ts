import { Request, Response, NextFunction } from 'express'
import { STATUS_CODE, successReponse } from './controller'
import paymentService from '../services/payment.service'

export const getAllPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentService.getAllPayment()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default { getAllPayment }
