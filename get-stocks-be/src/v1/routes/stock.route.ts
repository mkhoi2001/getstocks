import { Router } from 'express'
import stockController from '../controllers/stock.controller'
import { verifyUser, verifyAdmin, verifyRole } from './verify'

const router: Router = Router()

router.get('/getstockprov/:id', verifyAdmin, stockController.getStockProviderById)
router.patch('/getstockprov/typePack/', verifyAdmin, stockController.changeTypePackProvider)

router.get('/getstock/all', stockController.getAllGetStockItems)
router.get('/get-all', stockController.getAllActiveStocks)
router.get('/get-all/g', stockController.getAllActiveStockTypeG)
router.get('/all/g', stockController.getAllStockTypeG)
router.get('/all/p', stockController.getAllStockTypeP)
router.get('/get-all/p', stockController.getAllActiveStockTypeP)
router.get('/all', verifyAdmin, stockController.getAllStocks)
router.get('/:id', stockController.getStockById)
router.post('/', verifyAdmin, stockController.createStock)
router.patch('/getstock/status', verifyAdmin, stockController.updateGetStockItemStatus)
router.patch('/:id', verifyAdmin, stockController.updateStock)
router.patch('/:id/status', verifyAdmin, stockController.changeStockStatus)
router.delete('/:id', verifyAdmin, stockController.deleteStocks)

export default router
