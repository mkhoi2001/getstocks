import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'
import userService from '../services/user.service'
import { userValidate } from '../validations/user.validation'
import { validateData } from '../utils/validateData'
import { STATUS_CODE, successReponse } from './controller'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(userValidate.login, req.body, res)
    const result = await authService.login(req.body.email, req.body.password)
    const { refreshToken } = result
    res.cookie('rfToken', refreshToken, {
      httpOnly: true
    })

    successReponse(STATUS_CODE.OK, { token: result.token }, res)
    await authService.updateLastLogin(result.id)
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rfToken = req?.cookies.rfToken || ''
    const result = await authService.refreshToken(rfToken)
    console.log('result ', result)

    if (result && result?.refreshToken) {
      res.cookie('rfToken', result?.refreshToken, {
        httpOnly: true
      })
    }

    return successReponse(STATUS_CODE.OK, { token: result?.token }, res)
  } catch (error) {
    next(error)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rfToken = req?.cookies.rfToken || ''
    if (!rfToken) {
      return successReponse(STATUS_CODE.OK, { message: 'Logout!' }, res)
    }

    await authService.logout(rfToken)
    res.clearCookie('rfToken')
    return successReponse(STATUS_CODE.OK, { message: 'Logout!' }, res)
  } catch (error) {
    next(error)
  }
}

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(userValidate.login, req.body, res)
    const result = await authService.loginAdmin(req.body.email, req.body.password)
    successReponse(STATUS_CODE.OK, result, res)
    await authService.updateLastLogin(result.id)
  } catch (error) {
    next(error)
  }
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(userValidate.signUp, req.body, res)
    const checkEmail = userService.checkEmailIsExist(req.body.email)
    const checkUsername = userService.checkUsernameIsExist(req.body.username)

    await Promise.all([checkEmail, checkUsername])

    const result = await authService.signUp(req.body)
    return successReponse(STATUS_CODE.CREATED, result, res)
  } catch (error) {
    next(error)
  }
}

export const getInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.getInfo(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(userValidate.forgotPassword, req.body, res)

    const result = await authService.forgotPassword(req.body.email)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const verifyForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(userValidate.verifyForgotPassword, req.body, res)
    const result = await authService.verifyForgotPassword(req.body.email, req.body.token)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const passwordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(userValidate.passwordReset, req.body, res)
    const result = await authService.passwordReset(req.body.email, req.body.password)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateData(userValidate.login, req.body, res)
    const result = await authService.getApiKey(req.body.email, req.body.password)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.getProfile(req?.user?.id)
    return successReponse(STATUS_CODE.OK, result, res)
  } catch (error) {
    next(error)
  }
}

export default {
  refreshToken,
  logout,
  getApiKey,
  verifyForgotPassword,
  forgotPassword,
  signUp,
  getInfo,
  login,
  passwordReset,
  getProfile,
  loginAdmin
}
