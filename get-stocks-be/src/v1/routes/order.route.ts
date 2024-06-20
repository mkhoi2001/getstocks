import { Router } from 'express'
import { verifyRole, verifyAdmin } from './verify'
import orderHistoryController from '../controllers/orderHistory.controller'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 Mins
  max: 5,
  message: 'System is busy now !!!',
  legacyHeaders: false
})

const router: Router = Router()

router.get('/all', verifyAdmin, orderHistoryController.getAllOrderHistory)
router.get('/:id', verifyRole, orderHistoryController.getAllOrderHistoryByUserId)
router.get('/', verifyRole, orderHistoryController.getAllOrderHistoryOwn)
router.get('/package', verifyRole, orderHistoryController.getPackageOrderByUserId)
router.post('/paypal', verifyRole, orderHistoryController.createOrderByPaypal)
router.post('/', limiter, verifyRole, orderHistoryController.createOrderHistory)
router.patch('/:id/success', verifyAdmin, orderHistoryController.orderSuccess)
router.patch('/:id/fail', verifyAdmin, orderHistoryController.orderFail)

export default router
