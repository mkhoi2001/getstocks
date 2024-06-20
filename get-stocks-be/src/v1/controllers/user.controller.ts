import { NextFunction, Request, Response } from 'express'
import { STATUS_CODE, successReponse } from './controller'
import userService from '../services/user.service'

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUserById(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOverviewItembyUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getOverviewItembyUserId(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getOverviewOrderbyUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getOverviewOrderbyUserId(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUsers(req.query)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsers()
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const lockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUserStatus(req.params.id, false)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const unLockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUserStatus(req.params.id, true)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changeUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.changeUserStatus(req.params.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.checkUsernameIsExist(req.body.username, req.params.id)
    const result = await userService.updateUserInfo(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.checkUsernameIsExist(req.body.username, req?.user?.id)
    const result = await userService.updateUserInfo(req?.user?.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('chck here')
    const result = await userService.changePassword(req?.user?.id, req.body.password, req.body.newPassword)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.ressetPassword(req.params.id, req.body.password)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const plusBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.plusBalance(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const minusBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.minusBalance(req.params.id, req.body)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const updateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateApiKey(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getBalanceUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getBalanceUser(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  getUsers,
  getBalanceUser,
  updateApiKey,
  getAllUsers,
  getUserById,
  lockUser,
  unLockUser,
  changeUserStatus,
  getOverviewOrderbyUserId,
  updateUserInfo,
  updateProfile,
  changePassword,
  resetPassword,
  plusBalance,
  minusBalance,
  getOverviewItembyUserId
}
