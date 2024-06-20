import { Router } from 'express'
import itemController from '../controllers/item.controller'
import { verifyAdmin, verifyRole } from './verify'

const router: Router = Router()

router.get('/down', itemController.downloadItem)
router.post('/down-item', verifyRole, itemController.createItemDowload)
router.post('/down-item/g', verifyRole, itemController.downloadItemTypeG)
router.post('/down-item/p', verifyRole, itemController.downloadItemTypeP)
// router.post('/info', verifyRole, itemController.getItemInfo)
// router.post('/getlink', verifyRole, itemController.getLinkDownLoad)
// router.post('/status', verifyRole, itemController.checkDownLoadStatus)
router.get('/history/all', verifyAdmin, itemController.getAllItemHistory)
router.get('/history', verifyRole, itemController.getItemHistoryByUserId)
router.get('/history/:id', verifyAdmin, itemController.getItemHistoryByUserId)
router.post('/redown-item/:id', verifyRole, itemController.reDownloadItem)

export default router
