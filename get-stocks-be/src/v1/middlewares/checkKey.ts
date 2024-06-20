import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'

export const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req ', req.query)
    const apiKey = req.query.apikey
    if (!apiKey) {
      return res.status(401).json({ status: 401, message: 'Not authorized to access this resource' })
    }

    const user = await userService.findUserByApiKey(apiKey as string)
    console.log('user ', user)
    req.user = {
      id: user.id,
      role: user.role
    }
    next()
  } catch (error) {
    return res.status(401).json({ status: 401, message: 'Not authorized to access this resource' })
  }
}

export default { checkApiKey }
