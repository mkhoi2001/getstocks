import { Router } from 'express'
import { verifyAdmin } from './verify'
import orderHistoryController from '../controllers/orderHistory.controller'

const router: Router = Router()

router.post('/botsms', orderHistoryController.callbackHistoryBotsms)

export default router
