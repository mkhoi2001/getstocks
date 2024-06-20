import { getProviderList } from './../services/thirdService/getStock.service'
import { Router } from 'express'
import getStockController from '../controllers/getStock.controller'
import { verifyAdmin } from './verify'

const router: Router = Router()

router.get('/:id/profile', verifyAdmin, getStockController.getProfile)
router.get('/:id/providers', verifyAdmin, getStockController.getProviderList)
router.get('/:id/token', verifyAdmin, getStockController.getAccessToken)
router.get('/:id/orders', verifyAdmin, getStockController.getOrdersList)
router.get('/:id/balance', verifyAdmin, getStockController.getBalance)

export default router
