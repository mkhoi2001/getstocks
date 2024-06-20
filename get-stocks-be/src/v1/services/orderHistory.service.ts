import { PackageOrder, PackagePricingG, PackagePricingP } from './../models/package.model'
import HttpException from '../errors/httpException'
import { prisma } from '../../../prisma/prisma-client'
import { OrderHistory } from '../models/orderHistory.model'
import userService from './user.service'
import { OrderStatus } from '@prisma/client'
import { PackageType } from '../models/stock.model'
import { UserAmount } from '../models/user.model'
import moment from 'moment'
import { CHECK_PAYMENT, LangI18n } from '../../v1/utils/const'
import { BotSmsCb } from '../models/bank.model'
import systemConfigService from './systemConfig.service'
import botsmsService from './bank/botsms.service'
import acbService from './bank/api-acb'

export const getPackageOrderByUserId = async (userId: string = '') => {
  if (!userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const packageOrder = await prisma.packageOrder.findMany({ where: { userId: userId } })
  return {
    content: packageOrder,
    total: packageOrder.length
  }
}

export const getAllOrderHistory = async () => {
  const orders = await prisma.orderHistory.findMany({
    include: {
      packagePricingG: true,
      packagePricingP: true,
      user: { select: { id: true, email: true, packageOrder: true } }
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: orders,
    total: orders.length
  }
}

export const getOrderHistoryById = async (id: string) => {
  if (!id) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }

  const order = await prisma.orderHistory.findUnique({
    where: { id: id },
    include: {
      packagePricingG: true,
      packagePricingP: true,
      user: {
        include: { packageOrder: true }
      }
    }
  })
  if (!order) {
    throw new HttpException(404, LangI18n.__('order_not_found'))
  }
  return order
}

export const getAllOrderHistoryByUserId = async (userId: string = '') => {
  if (!userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const orderHistorys = await prisma.orderHistory.findMany({
    where: { userId: userId },
    include: { packagePricingG: true, packagePricingP: true },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: orderHistorys,
    total: orderHistorys.length
  }
}

export const createOrderHistory = async (userId: string = '', orderHistory: OrderHistory) => {
  const userFind = await userService.getUserById(userId)
  return await prisma.orderHistory.create({
    data: {
      userId: userId,
      content: orderHistory.content,
      provider: orderHistory.provider,
      cardNumber: orderHistory.cardNumber,
      phone: orderHistory.phone,
      cost: orderHistory.cost,
      currency: orderHistory.currency,
      packageType: orderHistory.packageType,
      packagePricingGId: orderHistory?.packagePricingGId,
      packagePricingPId: orderHistory?.packagePricingPId
    }
  })
}

export const checkUserPackageOrder = async (userId: string) => {
  if (!userId) {
    throw new HttpException(422, LangI18n.__('missing_parameter'))
  }
  const orders = await prisma.packageOrder.findMany({ where: { userId: userId, isExpired: false } })
  if (!orders.length) {
    // return undefined
    return null
  }

  // tim order gan nhat van con luot down moi ngay
  const order = orders.find((orderItem) => orderItem.dailyLeft > 0)
  return order
}

export const createOrderByPaypal = async (userId: string = '', orderHistory: OrderHistory) => {
  const userFind = await userService.getUserById(userId)
  const order = await prisma.orderHistory.create({
    data: {
      userId: userId,
      content: orderHistory.content,
      provider: 'Paypal',
      // cardNumber: orderHistory.cardNumber,
      // phone: orderHistory.phone,
      cost: orderHistory.cost,
      currency: orderHistory.currency,
      status: OrderStatus.SUCCESS,
      costPayment: orderHistory.costPayment || 0,
      packageType: orderHistory.packageType,
      packagePricingGId: orderHistory?.packagePricingGId,
      packagePricingPId: orderHistory?.packagePricingPId
    },
    include: {
      user: {
        include: { packageOrder: true }
      },
      packagePricingG: true,
      packagePricingP: true
    }
  })

  console.log('order create ', order)
  return await handleTransactionPaymentSuccess(order, orderHistory.costPayment)
}

const handleTransactionPaymentSuccess = async (orderFind: any, costPayment: number = 0) => {
  console.log('order ', orderFind)
  // cong tien vao cho user
  let updateUserPromise: any = ''
  let updateTotalPromise: any = ''
  if (orderFind.packageType === PackageType.G && orderFind.packagePricingG) {
    // update user
    const userAmount: UserAmount[] = []
    userAmount.push({ type: PackageType.G, amount: orderFind?.packagePricingG?.balanceG || 0 })
    userAmount.push({ type: PackageType.P, amount: orderFind?.packagePricingG?.balanceP || 0 })
    if (orderFind.user) {
      const balanceG = orderFind?.user?.balanceG || 0
      const balanceP = orderFind?.user?.balanceP || 0
      const addBalanceG = orderFind?.packagePricingG?.balanceG || 0
      const addBalanceP = orderFind?.packagePricingG?.balanceP || 0

      updateUserPromise = prisma.user.update({
        where: { id: orderFind.userId },
        data: {
          balanceG: balanceG + addBalanceG,
          balanceP: balanceP + addBalanceP,
          totalDeposit: {
            increment: costPayment > 0 ? costPayment : orderFind.cost
          }
        }
      })
    }
  } else if (orderFind.packageType === PackageType.P && orderFind.packagePricingP) {
    let timeExpire = new Date()
    timeExpire = moment()
      .add(orderFind?.packagePricingP?.dayExpires || 30, 'days')
      .toDate()
    updateTotalPromise = prisma.user.update({
      where: { id: orderFind.userId },
      data: {
        totalDeposit: {
          increment: orderFind.cost
        }
      }
    })

    let timePlus = timeExpire
    if (orderFind.user.packageOrder) {
      timePlus = orderFind.user.packageOrder.expireTime
      timePlus = moment(timePlus)
        .add(orderFind?.packagePricingP?.dayExpires || 30, 'days')
        .toDate()
    }

    updateUserPromise = prisma.packageOrder.upsert({
      where: { userId: orderFind.userId },
      create: {
        userId: orderFind.userId,
        dailyLeft: orderFind?.packagePricingP?.downPerDay || 20,
        expireTime: timeExpire
      },
      update: {
        dailyLeft: orderFind?.packagePricingP?.downPerDay || 20,
        expireTime: timePlus
      }
    })
  }

  const updateOrder = []
  if (updateUserPromise) updateOrder.push(updateUserPromise)
  if (updateTotalPromise) updateOrder.push(updateTotalPromise)

  const result = await prisma.$transaction(updateOrder)
  console.log('result ', result)
  return result[0]
}

export const orderSuccess = async (id: string = '', costPayment: number = 0) => {
  const orderFind = await getOrderHistoryById(id)
  clearCheckPayment()
  // if (orderFind.status !== OrderStatus.PENDING) {
  //   // return null
  //   console.log('trang thai da xu li', orderFind)
  //   throw new HttpException(400, 'Không thể thay đổi trạng thái đơn hàng này')
  // }

  const orderUpdatePromise = prisma.orderHistory.update({
    where: { id },
    data: {
      status: OrderStatus.SUCCESS,
      costPayment: costPayment
    }
  })

  // cong tien vao cho user
  let updateUserPromise: any = ''
  let updateTotalPromise: any = ''
  if (orderFind.packageType === PackageType.G && orderFind.packagePricingG) {
    // update user
    const userAmount: UserAmount[] = []
    userAmount.push({ type: PackageType.G, amount: orderFind?.packagePricingG?.balanceG || 0 })
    userAmount.push({ type: PackageType.P, amount: orderFind?.packagePricingG?.balanceP || 0 })
    if (orderFind.user) {
      const balanceG = orderFind?.user?.balanceG || 0
      const balanceP = orderFind?.user?.balanceP || 0
      const addBalanceG = orderFind?.packagePricingG?.balanceG || 0
      const addBalanceP = orderFind?.packagePricingG?.balanceP || 0

      updateUserPromise = prisma.user.update({
        where: { id: orderFind.userId },
        data: {
          balanceG: balanceG + addBalanceG,
          balanceP: balanceP + addBalanceP,
          totalDeposit: {
            increment: costPayment > 0 ? costPayment : orderFind.cost
          }
        }
      })
    }
  } else if (orderFind.packageType === PackageType.P && orderFind.packagePricingP) {
    let timeExpire = new Date()
    timeExpire = moment()
      .add(orderFind?.packagePricingP?.dayExpires || 30, 'days')
      .toDate()
    updateTotalPromise = prisma.user.update({
      where: { id: orderFind.userId },
      data: {
        totalDeposit: {
          increment: orderFind.cost
        }
      }
    })

    let timePlus = timeExpire
    if (orderFind.user.packageOrder) {
      timePlus = orderFind.user.packageOrder.expireTime
      timePlus = moment(timePlus)
        .add(orderFind?.packagePricingP?.dayExpires || 30, 'days')
        .toDate()
    }

    updateUserPromise = prisma.packageOrder.upsert({
      where: { userId: orderFind.userId },
      create: {
        userId: orderFind.userId,
        dailyLeft: orderFind?.packagePricingP?.downPerDay || 20,
        downDaily: orderFind?.packagePricingP?.downPerDay || 20,
        expireTime: timeExpire
      },
      update: {
        dailyLeft: orderFind?.packagePricingP?.downPerDay || 20,
        downDaily: orderFind?.packagePricingP?.downPerDay || 20,
        expireTime: timePlus
      }
    })
  }

  const updateOrder = [orderUpdatePromise]
  if (updateUserPromise) updateOrder.push(updateUserPromise)
  if (updateTotalPromise) updateOrder.push(updateTotalPromise)

  const result = await prisma.$transaction(updateOrder)
  return result
}

export const orderFail = async (id: string = '', reason: string = '') => {
  clearCheckPayment()
  const orderFind = await getOrderHistoryById(id)
  // if (orderFind.status !== OrderStatus.PENDING) {
  //   console.log('trang thai da xu li', orderFind)
  //   throw new HttpException(400, 'Không thể thay đổi trạng thái đơn hàng này')
  // }

  return await prisma.orderHistory.update({
    where: { id },
    data: {
      reason: reason,
      status: OrderStatus.FAIL
      // update li do that bai
    }
  })
}

export const callbackHistoryBotsms = async (payload: any) => {
  console.log('payload ', payload)
  console.log('==============\n')

  if (payload) {
    Object.keys(payload).forEach((key) => {
      console.log(key, ': ', payload[key], ' : ', typeof payload[key])
    })
  }

  return payload
}

let myTimeout: any
let myInterval: any
export const checkUserPayment = async (order: any) => {
  // Old code using botsms
  // const botsms = await systemConfigService.getSystemDataByKey('botsms')
  // if (!botsms) {
  //   // clearInterval(myInterval)
  //   clearCheckPayment()
  //   return null
  // }

  // const history = await botsmsService.getTransactionHistory(botsms.value)
  // if (history?.length) {
  //   const checkOrder = await prisma.orderHistory.findFirst({
  //     where: {
  //       id: order?.id,
  //       content: history[0]?.id_khach,
  //       cost: { lte: history[0]?.money },
  //       status: OrderStatus.PENDING
  //     }
  //   })
  //   if (checkOrder) {
  //     const result = await orderSuccess(checkOrder.id, history[0]?.money)
  //     // clearInterval(myInterval)
  //     clearCheckPayment()
  //     console.log('resilt ', result)
  //     return result
  //   } else {
  //     console.log('not found order', history[0], order?.id)
  //   }
  // }

  // New code using api-acb

  // const history = await botsmsService.getTransactionHistory(botsms.value)
  const history = await acbService.getTransactionPayment()

  if (history?.length) {
    console.log('history[0]?.description.split)[0]', history[0]?.description.split(' GD')[0])
    const checkOrder = await prisma.orderHistory.findFirst({
      where: {
        id: order?.id,
        content: {
          startsWith: history[0]?.description.split(' GD')[0]
        },
        cost: { lte: history[0]?.amount },
        status: OrderStatus.PENDING
      }
    })
    if (checkOrder) {
      const result = await orderSuccess(checkOrder.id, history[0]?.amount)
      // clearInterval(myInterval)
      clearCheckPayment()
      console.log('resilt ', result)
      return result
    } else {
      console.log('not found order', history[0], order?.id)
    }
  }
}

export const initCheckPayment = async (order: any) => {
  myInterval = setInterval(() => checkUserPayment(order), CHECK_PAYMENT.INTERNAL)
  myTimeout = setTimeout(function () {
    clearTimeout(myTimeout)
    clearInterval(myInterval)
    console.log('All intervals and timeouts cleared after 5 minutes')
    orderFail(order?.id, LangI18n.__('bill_not_found'))
  }, CHECK_PAYMENT.TIMEOUT) // Run the clearing logic after 5 minutes
}

export const clearCheckPayment = () => {
  console.log('clear check banking')
  clearInterval(myInterval)
  clearTimeout(myTimeout)
}

export const checkPaymentContinuous = async (order: any) => {
  initCheckPayment(order)
}

export const getOrderByApiKey = async (userId: string = '') => {
  const userFind = await userService.getUserById(userId)

  const orders = await prisma.orderHistory.findMany({
    where: { userId: userId },
    orderBy: { updatedAt: 'desc' }
    // select: {
    //   id: true,
    //   content: true,
    //   status: true,
    //   provider: true,
    //   cost: true,
    //   costPayment: true,
    //   currency: true,
    //   createdAt: true,
    //   updatedAt: true,
    //   packagePricingG: true,
    //   packagePricingP: true
    // }
  })

  const orderReturn = orders.map((item: any) => {
    const itemReturn: any = {
      id: item.id,
      packageId: item?.packagePricingG ? item?.packagePricingG?.id : item?.packagePricingP?.id,
      content: item.content,
      status: item.status,
      packageType: item.packageType,
      reason: item.reason || '',
      cost: item.cost,
      costPayment: item.costPayment,
      currency: item.currency,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }
    return itemReturn
  })
  return orderReturn
}

export default {
  createOrderByPaypal,
  getOrderByApiKey,
  getAllOrderHistory,
  callbackHistoryBotsms,
  checkUserPackageOrder,
  getPackageOrderByUserId,
  getAllOrderHistoryByUserId,
  orderSuccess,
  checkPaymentContinuous,
  orderFail,
  createOrderHistory,
  getOrderHistoryById
}
