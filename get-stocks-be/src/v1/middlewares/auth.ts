import { Request, Response, NextFunction } from 'express'
import jwtUtil from '../utils/jwt.util'
import { JwtPayload } from 'jsonwebtoken'
import HttpException from '../errors/httpException'
import userService from '../services/user.service'

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header: string | undefined = req.header('Authorization')
    if (!header) {
      return res.status(401).json({ status: 401, message: 'Not authorized to access this resource' })
    }

    const token = header.replace('Bearer ', '')
    const data: JwtPayload = await jwtUtil.verifyToken(token)

    const { role } = await authUser(data.id)
    req.user = {
      id: data.id,
      role
    }

    next()
  } catch (error) {
    return res.status(401).json({ status: 401, message: 'Not authorized to access this resource' })
  }
}

export const authUser = async (id: string = '') => {
  const user = await userService.findUser(id)
  if (!user) {
    throw new HttpException(401, 'Not authorized to access this resource')
  }

  return user
}

export const isAccessible = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // const { role } = await authUser(req?.user?.id)
    const role = req?.user?.role || ''
    if (!permissions.includes(role)) {
      res.status(401).json({ message: "You don't have permission", status: 401 })
    }
    next()
  }
}

export default { isAuthenticated, isAccessible, authUser }
