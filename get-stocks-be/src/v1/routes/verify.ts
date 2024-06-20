import auth from '../middlewares/auth'
import checkKey from '../middlewares/checkKey'
import { ROLES } from '../utils/const'
import { corsApi } from '../utils/corsApi'

export const verifyUser = [auth.isAuthenticated, auth.isAccessible([ROLES.USER])]
export const verifyAdmin = [auth.isAuthenticated, auth.isAccessible([ROLES.ADMIN])]
export const verifyRole = [auth.isAuthenticated, auth.isAccessible([ROLES.USER, ROLES.ADMIN])]

export const verifyKey = [checkKey.checkApiKey, auth.isAccessible([ROLES.USER, ROLES.ADMIN])]
