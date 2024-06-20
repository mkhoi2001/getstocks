import { SystemConfig } from '../models/config.model'
import systemConfigService from '../services/systemConfig.service'
import { SERVER_CONFIG, SHOW_STOCK_KEY } from './const'

export const getServerConfig = async () => {
  try {
    const data: SystemConfig = await systemConfigService.getSystemDataByKey(SHOW_STOCK_KEY)
    if (data && data?.value) {
      const dataParse = await JSON.parse(data.value)

      updateServerConfig(SHOW_STOCK_KEY, dataParse as SystemConfig)
    }

    console.log('SERVER_CONFIG:: ', SERVER_CONFIG[SHOW_STOCK_KEY])
  } catch (error) {
    console.log('ERROR: ', error)
  }
}

export const updateServerConfig = async (key: string, value: any) => {
  SERVER_CONFIG[key] = value
  console.log('SERVER_CONFIG UPDATE:: ', SERVER_CONFIG[SHOW_STOCK_KEY])
}

export const checkServerConfig = async (key: string) => {
  if (!SERVER_CONFIG[key]) {
    return 0
  }

  return Object.keys(SERVER_CONFIG[key]).length
}

export function generateRandomString(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters.charAt(randomIndex)
  }

  return result
}
