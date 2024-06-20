import axios from 'axios'

// const callbackurl =

export const callBotsmsHistory = async (callback: string) => {
  const botsms = `https://botsms.net/api/his_autobank_limit?url_callBack=${callback}&limit=10`
  const result = await axios.get(`${botsms}`)
  const data = result?.data
  if (!data) {
    return null
  }

  if (data?.status === 'error') {
    return null
  }

  return data
}

export const getTransactionHistory = async (callback: string = '') => {
  if (!callback) {
    return null
  } // const callback = `https://server.getfile.pro/api/v1/botsms`
  const result = await callBotsmsHistory(callback)
  return result
}

export function yourEventFunction(result: any) {
  return new Promise((resolve, reject) => {
    // Perform your event logic here

    // Example: Simulating an asynchronous event with a timeout
    setTimeout(() => {
      console.log('aloblo')
      resolve(result)
    }, 2000)
  })
}

export default { getTransactionHistory, callBotsmsHistory, yourEventFunction }
