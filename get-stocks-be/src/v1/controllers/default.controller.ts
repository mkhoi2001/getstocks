import { Request, Response, NextFunction } from 'express'
import { STATUS_CODE, successReponse } from './controller'
import defaultService from '../services/default.service'

export const getDefaultDataByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('fsfd ', req.params)
    const type = req.params.type
    const result = await defaultService.getDefaultDataByType(type)
    return successReponse(STATUS_CODE.CREATED, result, res)
  } catch (error) {
    next(error)
  }
}

export default { getDefaultDataByType }
