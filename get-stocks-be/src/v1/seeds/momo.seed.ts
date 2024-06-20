import { prisma } from '../../../prisma/prisma-client'

export const importMomo = async () => {
  const dataMomo = {
    phone: '0359181712',
    username: 'LE MINH UT'
  }

  const momoFind = await prisma.momo.findFirst({
    where: { phone: dataMomo.phone }
  })

  if (momoFind) {
    console.log('momo is already existing')
    return null
  }

  return await prisma.$transaction(async (tx) => {
    const data = await tx.momo.create({
      data: dataMomo
    })

    await tx.defaultData.create({
      data: {
        dataId: data.id,
        type: 'momo'
      }
    })
  })
}
