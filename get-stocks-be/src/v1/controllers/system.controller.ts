import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import systemService from '../services/system.service'
import { STATUS_CODE, successReponse } from './controller'

export const callService = async (req: Request, res: Response, next: NextFunction) => {
  //https://getstocks.net/botcheck/download/be07194f-c764-434d-8859-f1f6ef832b69?h=$2y$10$KXac8xgB7CEoHzc5NU1x1OhHFNvT/2yO/B11GAzMSxDPKXc5z1ckq&amp;t=1685222882
  const TOKEN =
    '###this_is_demo_token_bmJmIjoxNjg0ODMxMzU2LCJqdGkiOiJHYXFWV1JNc01mTUFsQjV5Iiwic3ViIjoxNTI2NiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.svQQrVWm4TktEpjgXzZZ0WZpNzwwmMYjsGuArj5TyIs'

  const link =
    'https://www.freepik.com/free-photo/modern-residential-district-with-green-roof-balcony-generated-by-ai_40970640.htm#&position=14&from_view=popular'
  const ispre = 1
  const dataSend = { link, ispre }
  // const result = await axios.post(`https://getstocks.net/api/v1/getinfo?token=${TOKEN}`, dataSend)
  // const dataReturn = result.data
  const dataDownload = await axios.post(`https://getstocks.net/api/v1/getlink?token=${TOKEN}`, {
    link,
    ispre
    // type: dataReturn?.data?.result?.support?.type ? Object.values(dataReturn?.data?.result?.support?.type)[0] : ''
  })
  const dataStatus = await axios.post(`https://getstocks.net/api/v1/download-status?token=${TOKEN}`, {
    slug: dataDownload?.data?.result?.provSlug,
    id: dataDownload?.data?.result?.itemID,
    ispre: dataDownload?.data?.result?.isPremium,
    type: dataDownload?.data?.result?.itemType
  })
  //   const result = 'sf'
  //   console.log('result ', result)
  //   result = JSON.parse(result)

  // return res.status(200).json({ data: dataReturn, download: dataDownload?.data, dataStatus: dataStatus?.data })
  return res.status(200).json({ download: dataDownload?.data, dataStatus: dataStatus?.data })
}

export const createSystem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemService.createSystem(req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllSystems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemService.getAllSystems()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getSystemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemService.getSystemByIdWithoutPass(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateSystem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemService.updateSystem(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeSystemSatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemService.changeSystemSatus(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getGetstockBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await systemService.getGetstockBalance()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  callService,
  getGetstockBalance,
  getSystemById,
  getAllSystems,
  createSystem,
  updateSystem,
  changeSystemSatus
}
