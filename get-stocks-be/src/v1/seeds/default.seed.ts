import { prisma } from '../../../prisma/prisma-client'

const DEFAULT_NAME = 'getstocks'
const MOMO_NAME = 'momo'
const MOMO_PHONE = '0359181712'

const importSys = async () => {
  const dataFind = await prisma.defaultData.findFirst({
    where: { type: DEFAULT_NAME }
  })
  if (dataFind) {
    console.log('importSys data is already existing')
    return null
  }
  const system = await prisma.system.findFirst({ where: { name: DEFAULT_NAME } })
  if (!system) {
    return null
  }

  await prisma.defaultData.create({
    data: {
      dataId: system.id,
      type: DEFAULT_NAME
    }
  })
}

const importMomo = async () => {
  const dataFind = await prisma.defaultData.findFirst({
    where: { type: MOMO_NAME }
  })
  if (dataFind) {
    console.log('importMomo data is already existing')
    return null
  }

  const momoFind = await prisma.momo.findFirst({
    where: { phone: MOMO_PHONE }
  })
  if (!momoFind) {
    return null
  }

  await prisma.defaultData.create({
    data: {
      dataId: momoFind.id,
      type: MOMO_NAME
    }
  })
}

export const importDefaultData = async () => {
  importSys()
  importMomo()
}
