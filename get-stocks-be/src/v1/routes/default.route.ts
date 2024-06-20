import { Router } from 'express'
import { verifyAdmin } from './verify'
import defaultController from '../controllers/default.controller'

const router: Router = Router()

router.get('/:type', verifyAdmin, defaultController.getDefaultDataByType)

export default router
