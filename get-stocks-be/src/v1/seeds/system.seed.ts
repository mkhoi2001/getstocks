import { prisma } from '../../../prisma/prisma-client'
import { getStockService } from '../services/thirdService'
import cryptoUtil from '../utils/crypto.util'

export const importSystem = async () => {
  const host = 'https://getstocks.net/api'
  const systemFind = await prisma.system.findFirst({ where: { host: host } })
  if (systemFind) {
    console.log('system is already existing')
    return null
  }

  const hashedPassword = await cryptoUtil.encrypt('demo_password')
  const result = await prisma.$transaction(async (tx) => {
    const data = await tx.system.create({
      data: {
        name: 'getstocks',
        host: host,
        email: 'email_login@vsm.vn',
        password: hashedPassword
      }
    })

    await tx.defaultData.create({
      data: {
        dataId: data.id,
        type: 'getstocks'
      }
    })
    return data
  })
  console.log('importSystem ', result)
  if (result) {
    await getStockService.getAccessToken(result?.id)
    await getStockService.getBalance(result?.id)
  }
}
