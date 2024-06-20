export enum STATUS {
  success = 'success',
  failed = 'failed'
}

export enum ROLES {
  // USER = 'USER',
  // ADMIN = 'ADMIN'
  // USER = '@UXVF',
  // ADMIN = '!@XDGBER',
  USER = '12dea96',
  ADMIN = 'd033e22a'
}

export const LANGUAGES = ['vn', 'en']

export const LangI18n: any = {}

export const SECRET_PASS_SYSTEM = 'SECRET_PASS_SYSTEM'

export const ERROR_STATUS = {}

export const SHOW_PAYPAL = {
  OPEN: `1`,
  CLOSE: `0`
}

export const GET_STOCK_PROV = 'getstock_prov'
export const SHOW_STOCK_KEY = 'show_stock'
export const AUTO_STOCK_G_KEY = 'auto_stock_g'
export const AUTO_STOCK_P_KEY = 'auto_stock_p'
export const GETSTOCKSTYPE = 'getstocks'
export const CURRENCY = 'usd_vnd'

export const SERVER_CONFIG: any = {
  showStocks: {}
}

export const CHECK_PAYMENT = {
  INTERNAL: 10000, // 10 seconds
  TIMEOUT: 5 * 60 * 1000 // Run the clearing logic after 10 minutes
}

export const ENV_CONFIG = {
  CLIENT_URL: process.env.CLIENT_URL || 'https://app.getfile.pro',
  PORT: process.env.PORT,
  EMAIL_APP: process.env.EMAIL_APP,
  APP_NAME: process.env.APP_NAME,
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  TOKEN_LIFE_ACCESS_TOKEN: process.env.TOKEN_LIFE_ACCESS_TOKEN,
  TOKEN_LIFE_REFRESH_TOKEN: process.env.TOKEN_LIFE_REFRESH_TOKEN,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  SECRET_PASS_SYSTEM: process.env.SECRET_PASS_SYSTEM
}
