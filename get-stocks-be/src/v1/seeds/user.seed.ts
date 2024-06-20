import { prisma } from '../../../prisma/prisma-client'
import bcrypt from 'bcryptjs'
import { ROLES } from '../utils/const'

const salt: string = bcrypt.genSaltSync(10)

export const importUsers = async () => {
  const adminEmail = 'admin@gmail.com'
  const adminFind = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (adminFind) {
    console.log('admin is already existing')
    return null
  }

  const hashedPassword = await bcrypt.hash('123123', salt)
  return await prisma.user.create({
    data: {
      email: adminEmail,
      username: `username`,
      password: hashedPassword,
      role: ROLES.ADMIN
    }
  })
}
