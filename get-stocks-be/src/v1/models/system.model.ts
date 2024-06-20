export type SystemProperty = {
  id: string
  systemId: string
  key: string
  value: string
  createdAt: Date
  updatedAt: Date
}

export type System = {
  id: string
  name: string
  enable: boolean
  host: string
  email: string
  username?: string | null
  password: string
  token?: string | null
  balance: number
  systemProperties?: SystemProperty[]
  createdAt: Date
  updatedAt: Date
}

export default System
