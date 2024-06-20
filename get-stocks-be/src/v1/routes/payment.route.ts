import { Router } from 'express'
import { verifyAdmin } from './verify'
import paymentController from '../controllers/payment.controller'

const router: Router = Router()

router.get('/', paymentController.getAllPayment)

export default router
