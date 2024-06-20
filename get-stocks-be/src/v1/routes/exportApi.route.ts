import { Router } from 'express'
import { verifyKey } from './verify'
import { corsApi } from '../utils/corsApi'
import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller'
import orderHistoryController from '../controllers/orderHistory.controller'
import itemController from '../controllers/item.controller'

const router: Router = Router()

router.get('/auth/profile', corsApi, verifyKey, authController.getProfile)
router.post('/auth/apikey', corsApi, authController.getApiKey)
router.get('/balance', corsApi, verifyKey, userController.getBalanceUser)
router.get('/orders/own', corsApi, verifyKey, orderHistoryController.getOrderByApiKey)
router.post('/download/info', corsApi, verifyKey, itemController.getItemInfo)
// router.post('/download/getlink', corsApi, verifyKey, itemController.getLinkDownLoad)
router.get('/download/code', corsApi, verifyKey, itemController.downloadItem)
router.post('/download/getcode', corsApi, verifyKey, itemController.getCodeItemDownload)

export default router
