import { importBank } from './bank.seed'
import { importMomo } from './momo.seed'
import { importStocks } from './stock.seed'
import { importSystem } from './system.seed'
import { importSystemConfig } from './systemConfig.seed'
import { importUsers } from './user.seed'
import { importDefaultData } from './default.seed'

export const initData = async () => {
  await importSystemConfig()
  // await importUsers()
  // await importSystem()
  // await importBank()
  // await importMomo()
  // await importStocks()
  // await importDefaultData()
}

export default initData
