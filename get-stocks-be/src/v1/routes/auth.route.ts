import authController from '../controllers/auth.controller'
import { verifyRole, verifyKey } from './verify'

import { Router } from 'express'
import { corsApi } from '../utils/corsApi'

const router: Router = Router()

router.post('/sign-up', authController.signUp)
router.post('/login', authController.login)
router.post('/refreshToken', authController.refreshToken)
router.post('/logout', authController.logout)
router.post('/login/admin', authController.loginAdmin)
router.get('/info', verifyRole, authController.getInfo)
router.post('/password-reset', authController.passwordReset)
router.post('/verify-password', authController.verifyForgotPassword)
router.post('/forgot-password', authController.forgotPassword)

export default router
