import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
const salt: string = bcrypt.genSaltSync(10)

async function main() {
  const hashedPassword = await bcrypt.hash('123123', salt)

  for (let i = 14; i <= 70; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@gmail.com`,
        username: `username${i}`,
        password: hashedPassword
      }
    })
  }
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
