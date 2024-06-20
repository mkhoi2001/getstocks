import { updatePackagePricingG } from './../services/package.service'
import { Router } from 'express'
import packageController from '../controllers/package.controller'
import { verifyUser, verifyAdmin, verifyRole } from './verify'

const router: Router = Router()

router.get('/g', verifyRole, packageController.getAllPackagePricingG)
router.get('/p', verifyRole, packageController.getAllPackagePricingP)
router.post('/g', verifyAdmin, packageController.createPackagePricingG)
router.post('/p', verifyAdmin, packageController.createPackagePricingP)
router.get('/g/:id', packageController.getPackagePricingGById)
router.get('/p/:id', packageController.getPackagePricingPById)
router.patch('/g/:id', verifyAdmin, packageController.updatePackagePricingG)
router.patch('/p/:id', verifyAdmin, packageController.updatePackagePricingP)
router.delete('/g/:id', verifyAdmin, packageController.deletePackagePricingG)
router.delete('/p/:id', verifyAdmin, packageController.deletePackagePricingP)

export default router
