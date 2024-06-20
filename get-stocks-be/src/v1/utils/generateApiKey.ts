import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const salt: string = bcrypt.genSaltSync(10)

export const generateApiKey = async () => {
  const token = crypto.randomUUID()
  console.log('token ', token)
  const hashedPassword = await bcrypt.hash(token, salt)
  console.log('hashedPassword ', hashedPassword)

  console.log('ranrom ', crypto.randomBytes(64).toString('hex'))
  return crypto.randomBytes(64).toString('hex')
}
