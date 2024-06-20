import { Router } from 'express'
import { verifyAdmin, verifyRole } from './verify'
import dashboardController from '../controllers/dashboard.controller'

const router: Router = Router()

router.get('/news/order/own', verifyRole, dashboardController.getNewsOrderHistoryOwn)
router.get('/news/item/own', verifyRole, dashboardController.getNewsItemHistoryOwn)
router.get('/news/order', verifyRole, dashboardController.getNewsOrderHistory)
router.get('/news/item', verifyRole, dashboardController.getNewsItemHistory)
router.get('/user', verifyAdmin, dashboardController.getOverviewUser)
router.get('/overview/all', verifyAdmin, dashboardController.getAllOrverview)
router.get('/order', verifyAdmin, dashboardController.getOverviewOrder)
router.get('/item-down', verifyAdmin, dashboardController.getOverviewItemDownload)
router.get('/user/:year', verifyAdmin, dashboardController.getUsersByMonthAndYear)
router.get('/order/:year', verifyAdmin, dashboardController.getOrdersByMonthAndYear)
router.get('/item/:year', verifyAdmin, dashboardController.getItemsByMonthAndYear)
router.get('/daily/user', verifyAdmin, dashboardController.getUsersByDailyWeek)
router.get('/date/user', verifyAdmin, dashboardController.getUsersByFilterDate)
router.get('/date/item', verifyAdmin, dashboardController.getItemsByFilterDate)
router.get('/date/order', verifyAdmin, dashboardController.getOrdersByFilterDate)

export default router
