import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
require('express-async-errors')
import helmet from 'helmet'
import compression from 'compression'
import { I18n } from 'i18n'
import path from 'path'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import initRoutesV1 from './v1/routes'
import handleError from './v1/middlewares/handleError'
import { LANGUAGES, LangI18n } from './v1/utils/const'
import taskSchedule from './v1/services/cron.service'
import { ENV_CONFIG } from './v1/utils/const'
import initData from './v1/seeds'
import { getServerConfig } from './v1/utils/utilFuncs'

const i18n = new I18n({
  locales: LANGUAGES,
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  register: LangI18n
})

const app = express()
app.use(cookieParser())
app.use(i18n.init)
app.use(express.json({ limit: '50kb' }))
app.use(express.urlencoded({ extended: true }))
app.use(
  compression({
    threshold: 100 * 1000 // 100kB
  })
)

app.use(helmet())
app.use(
  cors({
    origin: [ENV_CONFIG.CLIENT_URL, 'http://botsms.net', 'https://botsms.net'],
    credentials: true //access-control-allow-credentials:true
  })
)

// app.use(cors({ origin: true, credentials: true })) // Enable All CORS Requests

//rate Limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Mins
  max: 1000,
  message: 'System is busy now !!!',
  legacyHeaders: false
})

app.use(limiter)

app.set('trust proxy', 1)
app.get('/ip', (request, response) => response.send(request.ip))

initRoutesV1(app)

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Get-Stocks-API:1.0')
})

app.use(handleError)
app.use('*', (req: express.Request, res: express.Response) => {
  return res.status(404).json({ status: 404, message: 'Bad Request' })
})

taskSchedule()

const port = ENV_CONFIG.PORT || 8000

app.listen(port, async () => {
  // console.log('init data')
  //await initData()

  console.log(`App is listening on port ${port}`)
  // getServerConfig()
})

process.on('SIGINT', function () {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)')
  // some other closing procedures go here
  process.exit(0)
})
