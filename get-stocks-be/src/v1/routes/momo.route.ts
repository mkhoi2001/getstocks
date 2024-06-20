import { Router } from 'express'
import { verifyAdmin, verifyRole } from './verify'
import momoController from '../controllers/momo.controller'

const router: Router = Router()

router.post('/', verifyAdmin, momoController.createMomo)
router.get('/', verifyAdmin, momoController.getAllMomo)
router.get('/active', verifyRole, momoController.getMomoActive)
router.get('/:id', verifyRole, momoController.getMomoById)
router.delete('/:id', verifyAdmin, momoController.deleteMomo)
router.patch('/:id/status', verifyAdmin, momoController.changeMomoStatus)
router.patch('/:id', verifyAdmin, momoController.updateMomo)

export default router
