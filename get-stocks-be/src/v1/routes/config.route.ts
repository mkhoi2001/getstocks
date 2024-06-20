import { getConfigAdmin } from './../services/systemConfig.service'
import { Router } from 'express'
import { verifyAdmin } from './verify'
import systemConfigController from '../controllers/systemConfig.controller'

const router: Router = Router()

router.get('/client', systemConfigController.getConfigClient)
router.get('/', verifyAdmin, systemConfigController.getAllSystemConfig)
router.get('/k', verifyAdmin, systemConfigController.getSystemDataByKey)
router.get('/admin', verifyAdmin, systemConfigController.getConfigAdmin)
router.patch('/', verifyAdmin, systemConfigController.changeMultipleValue)
router.patch('/stock', verifyAdmin, systemConfigController.updateShowStockKey)
router.patch('/gsprov', verifyAdmin, systemConfigController.updateGetStockProv)
router.patch('/k', verifyAdmin, systemConfigController.changeValueByKey)
router.patch('/:id', verifyAdmin, systemConfigController.changeValueById)

export default router
