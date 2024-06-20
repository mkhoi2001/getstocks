import { Router } from 'express'
import userController from '../controllers/user.controller'
import { verifyUser, verifyAdmin, verifyRole } from './verify'

const router: Router = Router()

router.get('/', verifyAdmin, userController.getUsers)
router.get('/all', verifyAdmin, userController.getAllUsers)
router.get('/overview/item', verifyRole, userController.getOverviewItembyUserId)
router.get('/overview/order', verifyRole, userController.getOverviewOrderbyUserId)
router.patch('/lock/:id', verifyAdmin, userController.lockUser)
router.patch('/unlock/:id', verifyAdmin, userController.unLockUser)
router.patch('/status/:id', verifyAdmin, userController.changeUserStatus)
router.patch('/change-password', verifyRole, userController.changePassword)
router.patch('/apikey', verifyRole, userController.updateApiKey)
router.get('/:id', verifyAdmin, userController.getUserById)
router.patch('/:id', verifyRole, userController.updateUserInfo)
router.patch('/:id/plus', verifyAdmin, userController.plusBalance)
router.patch('/:id/minus', verifyAdmin, userController.minusBalance)
router.patch('/', verifyUser, userController.updateProfile)
router.patch('/reset-password/:id', verifyAdmin, userController.resetPassword)

export default router
