import axios from 'axios'

const accountParams = {
  rows: 20,
  username: '',
  password: '',
  accountNo: '',
  action: 'transactions'
}

export const getTransactionPayment = async () => {
  const url = 'https://acb-auto.vn/api-acb'
  const data: any = await axios.post(url, {
    ...accountParams
  })

  if (!data?.data?.success) {
    return null
  }

  return data.data.results.filter((item: any) => item.type === 'IN')
}

export default { getTransactionPayment }
