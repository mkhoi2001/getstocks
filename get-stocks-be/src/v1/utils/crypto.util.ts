import crypto from 'crypto'
import { secretPassSys } from './jwt.util'

const password = secretPassSys

// Encryption function
export function encrypt(text: string, password: string = secretPassSys) {
  const cipher = crypto.createCipher('aes-256-cbc', password)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// Decryption function
export function decrypt(encryptedText: string, password: string = secretPassSys) {
  const decipher = crypto.createDecipher('aes-256-cbc', password)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export default { encrypt, decrypt }

// Example usage
const text = 'demo_password'

// const encryptedText = encrypt(text, password)
// console.log('Encrypted:', encryptedText)

// const decryptedText = decrypt(encryptedText, password)
// console.log('Decrypted:', decryptedText)
