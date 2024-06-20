import { Router } from 'express'
import systemController from '../controllers/system.controller'
import { verifyAdmin } from './verify'

const router: Router = Router()

router.get('/call', systemController.callService)
router.post('/', verifyAdmin, systemController.createSystem)
router.get('/', verifyAdmin, systemController.getAllSystems)
router.get('/:id', verifyAdmin, systemController.getSystemById)
router.patch('/:id', verifyAdmin, systemController.updateSystem)
router.patch('/:id/status', verifyAdmin, systemController.changeSystemSatus)
router.get('/getstocks/balance', verifyAdmin, systemController.getGetstockBalance)

export default router
