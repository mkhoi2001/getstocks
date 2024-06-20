import nodemailer from 'nodemailer'
import contentForgotPassword from './ForgotPassword/content'
import { ENV_CONFIG } from '~/v1/utils/const'
import systemConfigService from '../systemConfig.service'

// const emailSender = ENV_CONFIG.EMAIL_APP
// const appName = ENV_CONFIG.APP_NAME || ''

let emailSender: string = ''
let appName: string = ''
let emailPass: string = ''
let emailHost: string = ''
let emailPort: string = ''

const getConfigEmail = async () => {
  const data = await systemConfigService.getEmailConfig()
  if (data) {
    ;(emailSender = data.emailSender || ''),
      (appName = data.appName || ''),
      (emailPass = data.emailPass || ''),
      (emailHost = data.emailHost || ''),
      (emailPort = data.emailPort || '')
  }
}

// console.log('meial info ', emailSender, appName, emailPort, emailPass, emailHost)
let transporter: any = null

const checkAppMailConfig = async () => {
  if (!emailSender || !appName || !emailPass || !emailPort || !emailHost) {
    await getConfigEmail()
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      // host: emailHost || ENV_CONFIG.EMAIL_HOST,
      // port: Number(emailPort) || 587,
      // secure: false, // true for 465, false for other ports
      // auth: {
      //   user: emailSender || ENV_CONFIG.EMAIL_APP, // generated ethereal user
      //   pass: emailPass || ENV_CONFIG.EMAIL_APP_PASSWORD // generated ethereal password
      // }

      host: emailHost,
      port: Number(emailPort) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailSender, // generated ethereal user
        pass: emailPass // generated ethereal password
      }
    })
  }
}

export const mailForgotPassword = async (data: { email: string; token: string }) => {
  await checkAppMailConfig()
  await transporter.sendMail({
    from: `${appName}👻 ${emailSender}`, // sender address
    to: data.email, // list of receivers
    subject: appName + ' ' + `✔`, // Subject line
    // text: 'Hello world?', // plain text body
    html: contentForgotPassword.contentForgotPasswordEn({ token: data.token, appName: appName }) // html body
  })
}

export default { mailForgotPassword }
