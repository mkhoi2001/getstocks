import User, { UserAmount } from '../models/user.model'
import { prisma } from '../../../prisma/prisma-client'
import HttpException from '../errors/httpException'
import paginationService from './pagination.service'
import Pagination from '../models/pagination.model'
import { KeysOfType, getTypeKeys } from '../utils/getTypeKeys'
import bcrypt from 'bcryptjs'
import { excludeField } from '../utils/excludeField'
import orderHistoryService from './orderHistory.service'
import { PackageOrder } from '../models/package.model'
import { CURRENCY, LangI18n } from '../utils/const'
import { generateApiKey } from '../utils/generateApiKey'
import systemConfigService from './systemConfig.service'

const salt: string = bcrypt.genSaltSync(10)

export const checkEmailIsExist = async (email: string) => {
  const userFind = await prisma.user.findUnique({ where: { email } })
  if (userFind) {
    throw new HttpException(422, LangI18n.__('email_is_exist'))
  }
  return true
}

export const checkUsernameIsExist = async (username: string, id: string = '') => {
  const userFind = await prisma.user.findFirst({
    where: {
      username,
      id: {
        not: id
      }
    }
  })
  console.log('userfind ', userFind)
  if (userFind) {
    throw new HttpException(422, LangI18n.__('username_is_exist'))
  }
  return true
}

export const findUser = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      isActive: true,
      role: true
    }
  })
  if (!user) {
    throw new HttpException(404, LangI18n.__('user_not_found'))
  }
  return user
}

export const findUserByApiKey = async (apiKey: string = '') => {
  if (!apiKey) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const user = await prisma.user.findFirst({
    where: {
      apiKey
    }
  })
  if (!user) {
    throw new HttpException(404, LangI18n.__('user_not_found'))
  }
  return user
}

export const getUserByEmail = async (email: string = '') => {
  if (!email) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (!user) {
    throw new HttpException(404, LangI18n.__('user_not_found'))
  }
  return excludeField<User, keyof User>(user as User, ['password']) as User
}

export const getUserById = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const user = await prisma.user.findUnique({
    where: { id }
  })
  if (!user) {
    throw new HttpException(404, LangI18n.__('user_not_found'))
  }
  return excludeField<User, keyof User>(user as User, ['password']) as User
}

export const checkUserPackageOrder = async (id: string = '') => {
  const userPromise = getUserById(id)
  const orderPromise = orderHistoryService.checkUserPackageOrder(id)

  const [userFind, order] = await Promise.all([userPromise, orderPromise])
  userFind.packageOrder = order

  return userFind
}

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phone: true,
      isActive: true,
      totalDeposit: true,
      role: true,
      balanceG: true,
      balanceP: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true
    }
  })
  return {
    content: users,
    total: users.length
  }
}

export const getUsers = async (pagination: Pagination) => {
  // const pagination: Pagination = {
  //   page,
  //   limit,
  //   select: {
  //     id: true,
  //     email: true,
  //     username: true,
  //     phone: true,
  //     isActive: true,
  //     role: true
  //   },
  //   orderBy: {
  //     email: 'asc'
  //   }
  // }

  pagination.select = {
    id: true,
    email: true,
    username: true,
    phone: true,
    isActive: true,
    role: true
  }

  pagination.orderBy = { username: 'asc' }

  // if (pagination.sort && pagination.direction) {
  //   pagination.orderBy = {
  //     [pagination.sort]: pagination.direction
  //   }
  //   delete pagination.direction
  //   delete pagination.sort
  // }

  const users = await paginationService.getResultPaginate(prisma.user, pagination)
  return users
}

export const updateUserStatus = async (id: string = '', status: boolean = true) => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      isActive: status
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phone: true,
      isActive: true,
      role: true
    }
  })
  if (!user) {
    throw new HttpException(404, LangI18n.__('user_not_found'))
  }
  return user
}

export const changeUserStatus = async (id: string = '') => {
  const userFind = await getUserById(id)

  const user = await prisma.user.update({
    where: { id },
    data: {
      isActive: !userFind.isActive
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phone: true,
      isActive: true,
      role: true
    }
  })

  return user
}

export const getBalanceUser = async (id: string = '') => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      email: true,
      balanceG: true,
      balanceP: true,
      totalDeposit: true
    }
  })

  const currencyData = await systemConfigService.getSystemDataByKey(CURRENCY)

  return {
    email: user?.email,
    G: user?.balanceG ? Math.ceil(user?.balanceG * parseFloat(currencyData?.value)) : 0,
    P: user?.balanceP ? Math.ceil(user?.balanceP * parseFloat(currencyData?.value)) : 0,
    totalDeposit: user?.totalDeposit
  }
}

export const updateUserInfo = async (id: string = '', data: User) => {
  const userFind = await getUserById(id)

  const dataUpdate: any = {}
  if (data.firstName) {
    dataUpdate.firstName = data.firstName
  }
  if (data.lastName) {
    dataUpdate.lastName = data.lastName
  }
  if (data.phone) {
    dataUpdate.phone = data.phone
  }
  if (data.username) {
    dataUpdate.username = data.username
  }

  const user = await prisma.user.update({
    where: { id: id },
    data: dataUpdate,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phone: true,
      isActive: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return user
}

export const changePassword = async (id: string = '', password: string, newPassword: string) => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  console.log('check service')

  const userFind = await prisma.user.findUnique({
    where: { id }
  })
  if (!userFind) {
    throw new HttpException(404, LangI18n.__('user_not_found'))
  }

  const isPasswordMatch = await bcrypt.compare(password, userFind.password)
  if (!isPasswordMatch) {
    throw new HttpException(422, LangI18n.__('password_wrong'))
  }

  const hashedPassword = await bcrypt.hash(newPassword, salt)

  const user = await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phone: true,
      isActive: true,
      role: true
    }
  })

  return user
}

export const ressetPassword = async (id: string, password: string) => {
  const userFind = await getUserById(id)

  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phone: true,
      isActive: true,
      role: true
    }
  })
  return user
}

export const minusBalance = async (id: string, data: UserAmount[]) => {
  const userFind = await getUserById(id)
  const dataUpdate: {
    balanceG: number
    balanceP: number
  } = {
    balanceG: userFind.balanceG,
    balanceP: userFind.balanceP
  }
  data.forEach((item) => {
    if (item.type === 'G') {
      dataUpdate.balanceG -= item.amount
      return
    }
    if (item.type === 'P') {
      dataUpdate.balanceP -= item.amount
      return
    }
  })

  const user = await prisma.user.update({
    where: { id },
    data: {
      balanceG: dataUpdate.balanceG < 0 ? 0 : dataUpdate.balanceG,
      balanceP: dataUpdate.balanceP < 0 ? 0 : dataUpdate.balanceP
    }
  })

  return excludeField<User, keyof User>(user as User, ['password']) as User
}

export const plusBalance = async (id: string, data: UserAmount[]) => {
  const userFind = await getUserById(id)
  const dataUpdate: {
    balanceG: number
    balanceP: number
  } = {
    balanceG: userFind.balanceG,
    balanceP: userFind.balanceP
  }
  data.forEach((item) => {
    if (item.type === 'G') {
      dataUpdate.balanceG += item.amount
      return
    }
    if (item.type === 'P') {
      dataUpdate.balanceP += item.amount
      return
    }
  })

  const user = await prisma.user.update({
    where: { id },
    data: {
      balanceG: dataUpdate.balanceG,
      balanceP: dataUpdate.balanceP
    }
  })

  return excludeField<User, keyof User>(user as User, ['password']) as User
}

export const getOverviewItembyUserId = async (userId: string = '') => {
  const userFind = await getUserById(userId)
  const currentDate = new Date()
  const queryCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const queryCurrentWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  )
  const queryCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

  const [currentMonth, currentWeek, currentDay, total] = await Promise.all([
    prisma.itemHistory.count({
      where: {
        userId: userId,
        createdAt: {
          gte: queryCurrentMonth
        }
      }
    }),
    prisma.itemHistory.count({
      where: {
        userId: userId,
        createdAt: {
          gte: queryCurrentWeek
        }
      }
    }),
    prisma.itemHistory.count({
      where: {
        userId: userId,
        createdAt: {
          gte: queryCurrentDay
        }
      }
    }),
    prisma.itemHistory.count({
      where: { userId: userId }
    })
  ])

  return {
    month: currentMonth,
    week: currentWeek,
    day: currentDay,
    total: total
  }
}

export const getOverviewOrderbyUserId = async (userId: string = '') => {
  const userFind = await getUserById(userId)

  const currentDate = new Date()
  const queryCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const queryCurrentWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  )
  const queryCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

  const [currentMonth, currentWeek, currentDay, total] = await Promise.all([
    prisma.orderHistory.count({
      where: {
        userId: userId,
        createdAt: {
          gte: queryCurrentMonth
        }
      }
    }),
    prisma.orderHistory.count({
      where: {
        userId: userId,

        createdAt: {
          gte: queryCurrentWeek
        }
      }
    }),
    prisma.orderHistory.count({
      where: {
        userId: userId,
        createdAt: {
          gte: queryCurrentDay
        }
      }
    }),
    prisma.orderHistory.count({
      where: {
        userId: userId
      }
    })
  ])

  return {
    month: currentMonth,
    week: currentWeek,
    day: currentDay,
    total: total
  }
}

export const updateApiKey = async (userId: string = '') => {
  const userFind = await getUserById(userId)
  const userUpdate = await storeNewApiKey(userId)
  return { key: userUpdate.apiKey }
}

export const storeNewApiKey = async (userId: string) => {
  const key = await generateApiKey()
  const userUpdate = await prisma.user.update({
    where: { id: userId },
    data: {
      apiKey: key
    }
  })
  return userUpdate
}

export default {
  getUserById,
  storeNewApiKey,
  updateApiKey,
  getOverviewItembyUserId,
  getOverviewOrderbyUserId,
  getUsers,
  getAllUsers,
  updateUserStatus,
  changeUserStatus,
  updateUserInfo,
  changePassword,
  ressetPassword,
  findUser,
  checkUsernameIsExist,
  checkEmailIsExist,
  plusBalance,
  minusBalance,
  checkUserPackageOrder,
  getUserByEmail,
  findUserByApiKey,
  getBalanceUser
}
