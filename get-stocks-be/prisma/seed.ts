import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
import { getStockService } from '../src/v1/services/thirdService'
import jwtUtil from '../src/v1/utils/jwt.util'
import { ROLES } from '../src/v1/utils/const'
import { initData } from '../src/v1/seeds'

const salt: string = bcrypt.genSaltSync(10)

// export const importUsers = async () => {
//   const adminEmail = 'admin@gmail.com'
//   const adminFind = await prisma.user.findUnique({ where: { email: adminEmail } })
//   if (adminFind) {
//     console.log('admin is already existing')
//     return null
//   }

//   const hashedPassword = await bcrypt.hash('123123', salt)
//   return await prisma.user.create({
//     data: {
//       email: adminEmail,
//       username: `username`,
//       password: hashedPassword,
//       role: ROLES.ADMIN
//     }
//   })
// }

// export const importMomo = async () => {
//   const dataMomo = {
//     phone: '0359181712',
//     username: 'LE MINH UT'
//   }

//   const momoFind = await prisma.momo.findFirst({
//     where: { phone: dataMomo.phone }
//   })

//   if (momoFind) {
//     console.log('momo is already existing')
//     return null
//   }

//   return await prisma.$transaction(async (tx) => {
//     const data = await tx.momo.create({
//       data: dataMomo
//     })

//     await tx.defaultData.create({
//       data: {
//         dataId: data.id,
//         type: 'momo'
//       }
//     })
//   })
// }

// export const importSystem = async () => {
//   const host = 'https://getstocks.net/api'
//   const systemFind = await prisma.system.findFirst({ where: { host: host } })
//   if (systemFind) {
//     console.log('system is already existing')
//     return null
//   }

//   const hashedPassword = await jwtUtil.generateTokenPassword({ password: 'demo_password' })
//   const result = await prisma.$transaction(async (tx) => {
//     const data = await tx.system.create({
//       data: {
//         name: 'getstocks',
//         host: host,
//         email: 'email_login@vsm.vn',
//         password: hashedPassword
//       }
//     })

//     await tx.defaultData.create({
//       data: {
//         dataId: data.id,
//         type: 'getstocks'
//       }
//     })
//     return data
//   })
//   console.log('importSystem ', result)
//   if (result) {
//     await getStockService.getAccessToken(result?.id)
//     await getStockService.getBalance(result?.id)
//   }
// }

// export const importBank = async () => {
//   const dataBank = {
//     bankName: 'Vietcombank',
//     cardNumber: '1021623700',
//     username: 'LE MINH UT'
//   }
//   const bankFind = await prisma.bank.findFirst({
//     where: { bankName: dataBank.bankName, cardNumber: dataBank.cardNumber }
//   })
//   if (bankFind) {
//     console.log('bank is already existing')
//     return null
//   }

//   await prisma.bank.create({
//     data: dataBank
//   })
// }
// export const importSystemConfig = async () => {
//   const dataBotsms = {
//     key: 'botsms',
//     value: `https://server.getfile.pro/api/v1/botsms`
//   }

//   const systemConfigFind = await prisma.systemConfig.findFirst({
//     where: { key: dataBotsms.key }
//   })

//   if (systemConfigFind) {
//     console.log('botsms is already existing')
//     return null
//   }

//   return await prisma.$transaction(async (tx) => {
//     const data = await tx.systemConfig.create({
//       data: dataBotsms
//     })
//   })
// }

async function main() {
  // importUsers()
  // importMomo()
  // importSystem()
  // importBank()
  // importSystemConfig()

  initData()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
