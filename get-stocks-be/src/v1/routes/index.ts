import express, { Router } from 'express'
import authRouter from './auth.route'
import userRouter from './user.route'
import systemRouter from './system.route'
import stockRouter from './stock.route'
import packageRouter from './package.route'
import itemRouter from './item.route'
import getStockRouter from './getStock.route'
import bankRouter from './bank.route'
import momoRouter from './momo.route'
import paymentRouter from './payment.route'
import orderRouter from './order.route'
import dashboardRouter from './dashboard.route'
import defaultRouter from './default.route'
import callbackRouter from './callback.route'
import systemConfigRouter from './config.route'
import exportApiRouter from './exportApi.route'
import { Request, Response, NextFunction } from 'express'
import { LANGUAGES } from '../utils/const'
import i18n from 'i18n'

const routes: Router = Router()

const detectLanguage = (req: Request, res: Response, next: NextFunction) => {
  let lang = req.body.lang || req.headers['Accept-Language'] || req.params.lang

  lang = LANGUAGES.find((language) => language === lang) || 'vn'
  i18n.setLocale(lang)

  next()
}

function initRoutesV1(app: express.Application) {
  // app.use(detectLanguage)

  routes.use('/users', userRouter)
  routes.use('/stocks', stockRouter)
  routes.use('/system', systemRouter)
  routes.use('/packages', packageRouter)
  routes.use('/item', itemRouter) // for user call api
  routes.use('/sys/stocks', getStockRouter) // for web using
  routes.use('/bank', bankRouter)
  routes.use('/momo', momoRouter)
  routes.use('/payment', paymentRouter)
  routes.use('/orders', orderRouter)
  routes.use('/dashboard', dashboardRouter)
  routes.use('/default', defaultRouter)
  routes.use('/config', systemConfigRouter)
  routes.use(exportApiRouter)

  routes.use('/auth', authRouter)
  // app.use('/auth', authRouter)

  routes.use(callbackRouter)
  app.use('/api/v1', routes)

  return app
}

export default initRoutesV1
