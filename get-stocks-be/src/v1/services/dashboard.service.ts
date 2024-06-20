import { Prisma } from '@prisma/client'
import HttpException from '../errors/httpException'
import { prisma } from 'prisma/prisma-client'
import { OrderStatus } from '../models/orderHistory.model'

// const currentDate = new Date()
// const queryCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
// const queryCurrentWeek = new Date(
//   currentDate.getFullYear(),
//   currentDate.getMonth(),
//   currentDate.getDate() - currentDate.getDay()
// )
// const queryCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
// const currentYear = currentDate.getFullYear()

export const getOverviewUser = async () => {
  const currentDate = new Date()
  const queryCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const queryCurrentWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  )
  const queryCurrentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

  const [currentMonth, currentWeek, currentDay, total] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: {
          gte: queryCurrentMonth
        }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: queryCurrentWeek
        }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: queryCurrentDay
        }
      }
    }),
    prisma.user.count()
  ])

  return {
    month: currentMonth,
    week: currentWeek,
    day: currentDay,
    total: total
  }
}

export const getOverviewOrder = async () => {
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
        createdAt: {
          gte: queryCurrentMonth
        }
      }
    }),
    prisma.orderHistory.count({
      where: {
        createdAt: {
          gte: queryCurrentWeek
        }
      }
    }),
    prisma.orderHistory.count({
      where: {
        createdAt: {
          gte: queryCurrentDay
        }
      }
    }),
    prisma.orderHistory.count()
  ])

  return {
    month: currentMonth,
    week: currentWeek,
    day: currentDay,
    total: total
  }
}

export const getOverviewItemDownload = async () => {
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
        createdAt: {
          gte: queryCurrentMonth
        }
      }
    }),
    prisma.itemHistory.count({
      where: {
        createdAt: {
          gte: queryCurrentWeek
        }
      }
    }),
    prisma.itemHistory.count({
      where: {
        createdAt: {
          gte: queryCurrentDay
        }
      }
    }),
    prisma.itemHistory.count()
  ])

  return {
    month: currentMonth,
    week: currentWeek,
    day: currentDay,
    total: total
  }
}

export const getAllOrverview = async () => {
  const userPromise = getOverviewUser()
  const orderPromise = getOverviewOrder()
  const itemPromise = getOverviewItemDownload()

  const [usersOverview, orderOverview, itemOverview] = await Promise.all([userPromise, orderPromise, itemPromise])
  return {
    user: usersOverview,
    order: orderOverview,
    item: itemOverview
  }
}

export const getUsersByMonthAndYear = async (year: number = new Date().getFullYear()) => {
  // const result = await prisma.user.groupBy({
  //   by: [
  //     {
  //       month: 'MONTH(createdAt)',
  //       year: 'YEAR(createdAt)'
  //     }
  //   ],
  //   _count: {
  //     createdAt: true
  //   }
  // })

  const usersByMonth: { count: bigint; month: number }[] =
    // await prisma.$queryRaw` SELECT COUNT(*) AS count, MONTH(createdAt) AS month FROM User GROUP BY MONTH(createdAt)`

    await prisma.$queryRaw`SELECT months.month, COALESCE(u.count, 0) AS count
    FROM (
      SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
      UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
      UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) AS months
    LEFT JOIN (
      SELECT COUNT(*) AS count, MONTH(createdAt) AS month
      FROM User
      WHERE YEAR(createdAt) = YEAR(CURRENT_DATE)
      GROUP BY MONTH(createdAt)
    ) AS u ON months.month = u.month
    ORDER BY months.month`

  let total = 0
  const formattedResult = usersByMonth.map((entry) => {
    total += Number(entry.count)
    return {
      count: Number(entry.count),
      month: entry.month >= 10 ? `${entry.month}/${year}` : `0${entry.month}/${year}`
    }
  })

  return {
    total,
    result: formattedResult
  }
}

export const getItemsByMonthAndYear = async (year: number = new Date().getFullYear()) => {
  const resultByMonth: { count: bigint; month: number }[] =
    await prisma.$queryRaw`SELECT months.month, COALESCE(u.count, 0) AS count
    FROM (
        SELECT 01 AS month UNION SELECT 02 UNION SELECT 3 UNION SELECT 4
        UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
        UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) AS months
    LEFT JOIN (
        SELECT COUNT(*) AS count, MONTH(createdAt) AS month
        FROM ItemHistory
        WHERE YEAR(createdAt) = YEAR(CURDATE())
        GROUP BY MONTH(createdAt)
    ) AS u ON months.month = u.month
    ORDER BY months.month`

  let total = 0
  const formattedResult = resultByMonth.map((entry) => {
    total += Number(entry.count)
    return {
      count: Number(entry.count),
      month: entry.month >= 10 ? `${entry.month}/${year}` : `0${entry.month}/${year}`
    }
  })

  return {
    total,
    result: formattedResult
  }
}

export const getOrdersByMonthAndYear = async (year: number = new Date().getFullYear()) => {
  const resultByMonth: { count: bigint; month: number }[] =
    await prisma.$queryRaw`SELECT months.month, COALESCE(u.count, 0) AS count
    FROM (
        SELECT 01 AS month UNION SELECT 02 UNION SELECT 3 UNION SELECT 4
        UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
        UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) AS months
    LEFT JOIN (
        SELECT COUNT(*) AS count, MONTH(createdAt) AS month
        FROM OrderHistory
        WHERE YEAR(createdAt) = YEAR(CURDATE())
        GROUP BY MONTH(createdAt)
    ) AS u ON months.month = u.month
    ORDER BY months.month`

  let total = 0
  const formattedResult = resultByMonth.map((entry) => {
    total += Number(entry.count)
    return {
      count: Number(entry.count),
      month: entry.month >= 10 ? `${entry.month}/${year}` : `0${entry.month}/${year}`
    }
  })

  return {
    total,
    result: formattedResult
  }
}

export const getUsersByDailyWeek = async () => {
  const currentDate = new Date()
  const startOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay() + 1
  )
  const endOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (7 - currentDate.getDay())
  )

  const newUserCounts = await prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startOfWeek,
        lte: endOfWeek
      }
    },
    _count: {
      createdAt: true
    }
  })

  const formattedResult = []
  const currentDatePointer = new Date(startOfWeek)

  while (currentDatePointer <= endOfWeek) {
    const formattedDate = currentDatePointer.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    const count =
      newUserCounts.find((entry) => entry.createdAt.toDateString() === currentDatePointer.toDateString())?._count
        ?.createdAt || 0

    formattedResult.push({ date: formattedDate, count })

    currentDatePointer.setDate(currentDatePointer.getDate() + 1)
  }
  return formattedResult
}

export const getUsersByFilterDate = async (from: any = '2023-01-01', to: any = new Date()) => {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  console.log('from ', fromDate, toDate)
  const result = await prisma.user.findMany({
    where: {
      createdAt: {
        lte: toDate,
        gte: fromDate
      }
    },
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
      updatedAt: true
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log('rest ', result.length)

  return {
    content: result,
    total: result.length
  }
}

export const getItemsByFilterDate = async (from: any = '2023-01-01', to: any = new Date()) => {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  const result = await prisma.itemHistory.findMany({
    where: {
      createdAt: {
        lte: toDate,
        gte: fromDate
      }
    },
    select: { createdAt: true, extension: true, id: true, fileName: true, provider: true, itemDCode: true },
    orderBy: { createdAt: 'desc' }
  })

  return {
    content: result,
    total: result.length
  }
}

export const getOrdersByFilterDate = async (from: any = '2023-01-01', to: any = new Date()) => {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  const result = await prisma.orderHistory.findMany({
    where: {
      createdAt: {
        lte: toDate,
        gte: fromDate
      }
    },
    include: {
      packagePricingG: true,
      packagePricingP: true,
      user: { select: { id: true, email: true, packageOrder: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return {
    content: result,
    total: result.length
  }
}

export const getNewsOrderHistory = async () => {
  const orders = await prisma.orderHistory.findMany({
    where: { status: OrderStatus.SUCCESS },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      packagePricingG: { select: { name: true } },
      packagePricingP: { select: { name: true } },
      user: { select: { id: true, username: true } }
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: orders,
    total: orders.length
  }
}

export const getNewsItemHistory = async () => {
  const items = await prisma.itemHistory.findMany({
    select: {
      user: { select: { id: true, username: true } },
      updatedAt: true,
      createdAt: true,
      id: true,
      provider: true
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: items,
    total: items.length
  }
}

export const getNewsOrderHistoryOwn = async (userId: string = '') => {
  if (!userId) return { content: [], total: 0 }
  const orders = await prisma.orderHistory.findMany({
    where: { status: OrderStatus.SUCCESS, userId: userId },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      packagePricingG: { select: { name: true } },
      packagePricingP: { select: { name: true } },
      user: { select: { id: true, username: true } }
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: orders,
    total: orders.length
  }
}

export const getNewsItemHistoryOwn = async (userId: string = '') => {
  if (!userId) return { content: [], total: 0 }

  const items = await prisma.itemHistory.findMany({
    where: { userId: userId },
    select: {
      user: { select: { id: true, username: true } },
      updatedAt: true,
      createdAt: true,
      id: true,
      provider: true
    },
    orderBy: { updatedAt: 'desc' }
  })
  return {
    content: items,
    total: items.length
  }
}

export default {
  getNewsOrderHistoryOwn,
  getNewsItemHistoryOwn,
  getNewsItemHistory,
  getNewsOrderHistory,
  getUsersByDailyWeek,
  getItemsByFilterDate,
  getUsersByFilterDate,
  getOrdersByFilterDate,
  getOrdersByMonthAndYear,
  getItemsByMonthAndYear,
  getOverviewUser,
  getOverviewOrder,
  getOverviewItemDownload,
  getUsersByMonthAndYear,
  getAllOrverview
}
