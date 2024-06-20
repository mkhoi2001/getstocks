import { prisma } from '../../../../prisma/prisma-client'
import { ROLES } from '~/v1/utils/const'

const updateUser = async () => {
  prisma.$transaction(async (tx) => {
    await tx.user.updateMany({
      where: {
        role: 'USER'
      },
      data: {
        role: ROLES.USER
      }
    })

    await tx.user.updateMany({
      where: {
        role: 'ADMIN'
      },
      data: {
        role: ROLES.ADMIN
      }
    })
  })
}

updateUser()
