import cron from 'node-cron'
import { prisma } from 'prisma/prisma-client'
import moment from 'moment'
import stockService from './stock.service'
import gsItemService from './gs-item.service'

const resetDailyDownload = async () => {
  console.log('running a task every midnight')
  const packageOrders = await prisma.packageOrder.findMany({ where: { isExpired: false } })
  const currentTime = moment()
  if (packageOrders.length > 0) {
    const packagesUpdate = packageOrders.map((item) => {
      if (currentTime.isAfter(item.expireTime)) {
        item.isExpired = true
        item.dailyLeft = 0
        return item
      }

      item.dailyLeft = item?.downDaily || 20
      return item
    })

    const updateMany = packagesUpdate.map((item) => prisma.packageOrder.update({ where: { id: item.id }, data: item }))
    await prisma.$transaction(updateMany)
  }
}

const scheduleCron = async () => {
  resetDailyDownload()
  // stockService.updateAutoStockTypeG()
  // stockService.updateAutoStockTypeP()
  gsItemService.autoUpdateItems()
}

export const task = cron.schedule('0 0 0 * * *', scheduleCron) // run every midnight

// const task = cron.schedule("*/10 * * * * *", scheduleCron); // run every 10 seconds
// const task = cron.schedule('*/1 * * * * ', scheduleCron) // run every 1 minutes

const taskSchedule = () => {
  task.start()
}

export default taskSchedule
