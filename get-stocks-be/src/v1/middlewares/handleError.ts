import { Request, Response, NextFunction } from 'express'
import { LangI18n } from '../utils/const'

import HttpException from '../errors/httpException'

const handleError = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  console.log('handleErr:: ', err)
  if (err && err?.errorCode) {
    return res.status(err.errorCode).json({ status: err.errorCode, message: err.message })
  }
  console.error('error from server: ', err.message)
  console.log(err)
  return res.status(500).json({ status: 500, message: LangI18n.__('server_error') })
}

export default handleError
