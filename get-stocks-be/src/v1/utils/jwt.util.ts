import jwt, { JwtPayload } from 'jsonwebtoken'
import HttpException from '../errors/httpException'
import { ENV_CONFIG } from './const'

const tokenLife = ENV_CONFIG.TOKEN_LIFE_ACCESS_TOKEN || '1h'
export const refreshTokenLife = ENV_CONFIG.TOKEN_LIFE_REFRESH_TOKEN || '1d'
export const secret = ENV_CONFIG.TOKEN_SECRET || 'get-secret'
export const secretPassSys = ENV_CONFIG.SECRET_PASS_SYSTEM || 'SECRET_PASS_SYSTEM'

export const generateToken = async (data: any) => {
  if (!data) return null
  return await jwt.sign(data, secret, { expiresIn: tokenLife })
}

export const generateRefreshToken = async (data: any) => {
  if (!data) return null
  return await jwt.sign(data, secret, { expiresIn: refreshTokenLife })
}

export const reGenerateRefreshToken = async (data: { id: string; exp: number }) => {
  if (!data) return null
  return await jwt.sign(data, secret)
}

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  if (!token) return new HttpException(401, 'Not authorized to access this resource')

  return (await jwt.verify(token, secret)) as JwtPayload
}

export const generateTokenPassword = async (data: any): Promise<string> => {
  if (!data) return ''
  return (await jwt.sign(data, secretPassSys)) as string
}

export const verifyTokenPassword = async (token: string): Promise<JwtPayload> => {
  if (!token) return new HttpException(500, 'Error from internal Server')

  return (await jwt.verify(token, secretPassSys)) as JwtPayload
}

export default {
  generateToken,
  verifyToken,
  generateRefreshToken,
  generateTokenPassword,
  verifyTokenPassword,
  reGenerateRefreshToken
}
