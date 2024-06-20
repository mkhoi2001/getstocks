import { prisma } from '../../../prisma/prisma-client'
import { GET_STOCK_PROV, SHOW_STOCK_KEY } from '../utils/const'

export const createSystemConfig = async (dataInput: { key: string; value: string }) => {
  const systemConfigFind = await prisma.systemConfig.findFirst({
    where: { key: dataInput.key }
  })

  if (systemConfigFind) {
    console.log(`${dataInput.key} : ${dataInput.value} is already exists`)
    return null
  }

  return await prisma.$transaction(async (tx) => {
    const data = await tx.systemConfig.create({
      data: dataInput
    })
  })
}

export const importSystemConfig = async () => {
  const showStockValue = JSON.stringify({ percent_normal: 10, percent_pre: 20, auto_pre: 1, auto_nor: 0 }, null, '\t')
  const getStockProv = JSON.stringify({ nor: 10, pre: 20 }, null, '\t')

  const data = [
    {
      key: GET_STOCK_PROV,
      value: getStockProv
    },
    {
      key: SHOW_STOCK_KEY,
      value: showStockValue
    },
    {
      key: 'usd_vnd',
      value: `23500`
    },
    {
      key: 'client_id_paypal',
      value: ``
    },
    {
      key: 'show_paypal',
      value: `1`
    },
    {
      key: 'facebook',
      value: `https://www.facebook.com/`
    },
    // {
    //   key: 'telegram',
    //   value: `0359181712`
    // },
    {
      key: 'zalo',
      value: `0359181712`
    },

    {
      key: 'app_name',
      value: `Getfile - Vsm`
    },
    {
      key: 'botsms_content',
      value: `getfile`
    },
    {
      key: 'botsms',
      value: `https://server.getfile.pro/api/v1/botsms`
    },
    {
      key: 'email_port',
      value: `587`
    },
    {
      key: 'email_host',
      value: `smtp.gmail.com`
    },
    {
      key: 'email_app',
      value: `mymemory2409@gmail.com`
    },
    {
      key: 'email_password',
      value: `rztwikruwhrmjjni`
    },
    {
      key: 'footer',
      value: `© 2023 Getfile - Vsm`
    },
    {
      key: 'ul',
      value: ``
    },
    {
      key: 'banner',
      value: ''
    },
    {
      key: 'guide_box',
      value: ''
    }
  ]

  const dataPromise: any = []
  data.forEach((item: { key: string; value: string }) => {
    dataPromise.push(createSystemConfig(item))
  })

  await Promise.all(dataPromise)
}
