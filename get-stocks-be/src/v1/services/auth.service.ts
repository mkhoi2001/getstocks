import { PackagePricingP } from './../models/package.model'
import User from '../models/user.model'
import { prisma } from '../../../prisma/prisma-client'
import HttpException from '../errors/httpException'
import bcrypt from 'bcryptjs'
import jwtUtil, { refreshTokenLife, secret } from '../utils/jwt.util'
import { ROLES } from '../utils/const'
import emailService from './email/email.service'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import userService from './user.service'
import { LangI18n } from '../utils/const'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateApiKey } from '../utils/generateApiKey'

const salt: string = bcrypt.genSaltSync(10)

const generateToken = async (data: { id: string }) => {
  const createToken = jwtUtil.generateToken(data)
  const createRefreshToken = jwtUtil.generateRefreshToken(data)
  const [token, refreshToken] = await Promise.all([createToken, createRefreshToken])
  if (refreshToken) {
    await prisma.jToken.upsert({
      where: { userId: data.id },
      update: {
        rfToken: refreshToken || ''
      },
      create: {
        userId: data.id,
        rfToken: refreshToken || ''
      }
    })
  }
  return { token, refreshToken }
}

const reGenerateToken = async (data: { id: string; exp: number }) => {
  const createToken = jwtUtil.generateToken({ id: data.id })
  const createRefreshToken = jwtUtil.reGenerateRefreshToken(data)
  const [token, refreshToken] = await Promise.all([createToken, createRefreshToken])
  if (refreshToken) {
    await prisma.jToken.upsert({
      where: { userId: data.id },
      update: {
        rfToken: refreshToken || ''
      },
      create: {
        userId: data.id,
        rfToken: refreshToken || ''
      }
    })
  }
  return { token, refreshToken }
}

export const authUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new HttpException(404, LangI18n.__('login_failed'))
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new HttpException(404, LangI18n.__('login_failed'))
  }

  if (!user.isActive) {
    throw new HttpException(422, LangI18n.__('account_inactive'))
  }
  return user
}

export const getApiKey = async (email: string, password: string) => {
  const user = await authUser(email, password)
  if (!user?.apiKey) {
    const data = await userService.storeNewApiKey(user.id)
    return { key: data.apiKey }
  }

  return { key: user.apiKey }
}

export const login = async (email: string, password: string) => {
  const user = await authUser(email, password)

  const { token, refreshToken } = await generateToken({ id: user.id })

  return { token, refreshToken, id: user.id }
}

export const refreshToken = async (rfToken: string): Promise<void | { token: string; refreshToken: string }> => {
  if (!rfToken) {
    console.log('not provided rf')
    throw new HttpException(400, 'Please login now')
  }

  const tokenStore = await prisma.jToken.findFirst({ where: { rfToken: rfToken } })
  if (!tokenStore) {
    console.log('not find rf')
    throw new HttpException(400, 'Please login now')
  }

  return await jwt.verify(rfToken, secret, async (err: jwt.VerifyErrors | null, user) => {
    if (err) {
      console.log('rf expired')
      throw new HttpException(400, 'Please login now')
    }
    console.log('user ', user)
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 24)

    const data = user as jwt.JwtPayload

    const { token, refreshToken } = await reGenerateToken({
      id: data?.id,
      exp: data?.exp || Math.floor(expirationDate.getTime() / 1000)
    })
    console.log('token ', token, refreshToken)
    return { token, refreshToken }
  })
  // return {
  //   token: '',
  //   refreshToken: ''
  // }
}

export const logout = async (rfToken: string) => {
  return await prisma.jToken.deleteMany({ where: { rfToken: rfToken } })
}

export const loginAdmin = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { email, role: ROLES.ADMIN } })
  console.log('user ', user)
  if (!user) {
    throw new HttpException(400, LangI18n.__('login_failed'))
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new HttpException(400, LangI18n.__('login_failed'))
  }

  if (!user.isActive) {
    throw new HttpException(422, LangI18n.__('account_inactive'))
  }

  const { token, refreshToken } = await generateToken({ id: user.id })

  return { token, refreshToken, id: user.id }
}

export const signUp = async (userInput: User) => {
  const hashedPassword = await bcrypt.hash(userInput.password, salt)

  return await prisma.user.create({
    data: {
      email: userInput.email,
      username: userInput.username,
      password: hashedPassword,
      role: ROLES.USER
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true
    }
  })
}

export const getInfo = async (id: string = '') => {
  if (!id) throw new HttpException(404, LangI18n.__('user_not_found'))
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      phone: true,
      balanceG: true,
      balanceP: true,
      createdAt: true,
      updatedAt: true,
      firstName: true,
      lastName: true,
      totalDeposit: true,
      packageOrder: true
    }
  })
}

export const getProfile = async (id: string = '') => {
  if (!id) throw new HttpException(404, LangI18n.__('user_not_found'))
  return await prisma.user.findUnique({
    where: { id },
    select: {
      email: true,
      username: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      firstName: true,
      lastName: true
    }
  })
}

export const forgotPassword = async (email: string) => {
  const user = await userService.getUserByEmail(email)

  const resetToken = uuidv4().split('-')[0]
  let expireTime = new Date()
  expireTime = moment().add(3, 'hours').toDate()
  console.log('expirestime ', expireTime, expireTime.toString())

  const token = await prisma.passwordReset.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      token: resetToken,
      expireTime: expireTime
    },
    update: {
      token: resetToken,
      expireTime: expireTime,
      isValid: false
    }
  })

  await emailService.mailForgotPassword({ email: email, token: resetToken })
  return { message: LangI18n.__('forgot_password'), data: email }
}

export const passwordReset = async (email: string = '', password: string = '') => {
  const user = await userService.getUserByEmail(email)
  const tokenVerify = await prisma.passwordReset.findFirst({
    where: { userId: user.id, token: '', isValid: true }
  })

  if (!tokenVerify) {
    throw new HttpException(404, LangI18n.__('bad_request'))
  }

  await prisma.passwordReset.update({ where: { userId: user.id }, data: { isValid: false } })

  return await userService.ressetPassword(user.id, password)
}

export const verifyForgotPassword = async (email: string = '', tokenReset: string = '') => {
  const user = await userService.getUserByEmail(email)
  const tokenVerify = await prisma.passwordReset.findFirst({
    where: { userId: user.id, token: tokenReset, isValid: false }
  })

  if (!tokenVerify) {
    throw new HttpException(404, LangI18n.__('bad_request'))
  }

  if (moment().isAfter(tokenVerify?.expireTime)) {
    throw new HttpException(404, LangI18n.__('token_invalid'))
  }

  await prisma.passwordReset.update({
    where: { userId: user.id },
    data: { isValid: true, token: '' }
  })
}

export const updateLastLogin = async (userId: string = '') => {
  if (!userId) return null

  return await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() }
  })
}

export default {
  updateLastLogin,
  logout,
  forgotPassword,
  refreshToken,
  verifyForgotPassword,
  passwordReset,
  loginAdmin,
  signUp,
  getInfo,
  login,
  getApiKey,
  getProfile
}
