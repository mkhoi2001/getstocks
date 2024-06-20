import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import itemService from '../services/item.service'
import itemHistoryService from '../services/itemHistory.service'
import { getStockService } from '../services/thirdService'
import { validateData } from '../utils/validateData'
import itemValidate from '../validations/item.validation'
import { STATUS_CODE, successReponse } from './controller'
import gsItemService from '../services/gs-item.service'

// export const down1 = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     console.log('vo day download 1')
//     const itemDCode = req.query.code || '49f0cdd2-2abe-4c8e-a27c-e1f74d1a858d'
//     const link = `https://getstocks.net/api/v1/download/${itemDCode}?token=###this_is_demo_token_bmJmIjoxNjg0ODMxMzU2LCJqdGkiOiJHYXFWV1JNc01mTUFsQjV5Iiwic3ViIjoxNTI2NiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.svQQrVWm4TktEpjgXzZZ0WZpNzwwmMYjsGuArj5TyIs`
//     const fileName = 'freepik_standard_40964074.jpg'

//     const response = await axios.get(link, { responseType: 'stream' })

//     res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
//     res.setHeader('Content-Type', response.headers['content-type'])

//     response.data.pipe(res)
//   } catch (error) {
//     console.log('error ', error)
//     next(error)
//   }
// }

export const getItemInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateLinkInfo, req.body, res)
    const link = req.body.link
    const type = req.body.type
    // const result = await itemService.getItemInfo(link, type)
    const result = await gsItemService.getItemInfo(link, type)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getCodeItemDownload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateLinkInfo, req.body, res)
    const link = req.body.link
    const type = req.body.type
    // const result = await itemService.getCodeItemDownload(req?.user?.id, link, type)
    const result = await gsItemService.getCodeItemDownload(req?.user?.id, link, type)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getLinkDownLoad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateLink, req.body, res)

    const link = req.body.link
    const result = await itemService.getLinkDownLoad(link)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const checkDownLoadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateLink, req.body, res)

    const link = req.body.link
    const result = await itemService.checkDownloadStatus(link)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const createItemDowload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateLink, req.body, res)

    const link = req.body.link
    const result = await itemService.createItemDowload(req?.user?.id, link)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const downloadItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateItemDown, req.query, res)
    const itemDcode = req.body.code || req.query.code
    const itemHistoryFind = await itemHistoryService.getItemByCode(itemDcode)
    const linkDownload = await getStockService.generateLinkDownload(itemHistoryFind.system, itemHistoryFind.itemDCode)

    const response = await axios.get(linkDownload, { responseType: 'stream' })
    // console.log('resonse ', response)

    res.setHeader('Content-Disposition', `attachment; filename=${itemHistoryFind.fileName}`)
    res.setHeader('Content-Type', response.headers['content-type'])

    response.data.pipe(res)
  } catch (error) {
    console.log('err ', error)
    next(error)
  }
}

export const downloadItemTypeG = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateDownloadG, req.body, res)

    const link = req.body.link
    const type = req.body.type
    // const result = await itemService.downloadItemTypeG(req?.user?.id, link, type)
    const result = await gsItemService.downloadItemTypeG(req?.user?.id, link, type)

    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    console.log('err ', error)
    next(error)
  }
}

export const reDownloadItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateId, req.params, res)

    const link = req.body.link
    const type = req.body.type
    const result = await itemService.reDownloadItem(req.params.id)

    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    console.log('err ', error)
    next(error)
  }
}

export const downloadItemTypeP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(itemValidate.validateDownloadP, req.body, res)

    const link = req.body.link
    const type = req.body.type
    // const result = await itemService.downloadItemTypeP(req?.user?.id, link, type)
    const result = await gsItemService.downloadItemTypeP(req?.user?.id, link, type)

    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    console.log('err ', error)
    next(error)
  }
}

export const getItemHistoryByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await itemHistoryService.getItemHistoryByUserId(req.params.id || req?.user?.id)

    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    console.log('err ', error)
    next(error)
  }
}

export const getAllItemHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await itemHistoryService.getAllItemHistory()

    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    console.log('err ', error)
    next(error)
  }
}

export default {
  getAllItemHistory,
  downloadItemTypeG,
  createItemDowload,
  reDownloadItem,
  downloadItemTypeP,
  getCodeItemDownload,
  // down1,
  getItemInfo,
  getLinkDownLoad,
  checkDownLoadStatus,
  downloadItem,
  getItemHistoryByUserId
}
