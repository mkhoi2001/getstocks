import { Router } from 'express'
import { verifyAdmin } from './verify'
import bankController from '../controllers/bank.controller'

const router: Router = Router()

router.post('/', verifyAdmin, bankController.createBank)
router.get('/', verifyAdmin, bankController.getAllBanks)
router.get('/active', bankController.getAllActiveBanks)
router.get('/get1', bankController.getTransactionHistory)
router.get('/:id', verifyAdmin, bankController.getBankById)
router.delete('/:id', verifyAdmin, bankController.deleteBank)
router.patch('/:id/status', verifyAdmin, bankController.changeBankStatus)
router.patch('/:id', verifyAdmin, bankController.updateBank)

export default router
