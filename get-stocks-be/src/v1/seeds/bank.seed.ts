import { prisma } from '../../../prisma/prisma-client'

export const importBank = async () => {
  const dataBank = {
    bankName: 'Vietcombank',
    cardNumber: '1021623700',
    username: 'LE MINH UT'
  }
  const bankFind = await prisma.bank.findFirst({
    where: { bankName: dataBank.bankName, cardNumber: dataBank.cardNumber }
  })
  if (bankFind) {
    console.log('bank is already existing')
    return null
  }

  await prisma.bank.create({
    data: dataBank
  })
}
