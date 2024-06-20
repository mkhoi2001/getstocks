declare namespace Express {
  export interface Request {
    user?: {
      id?: string
      role?: string
    }
    lang?: string
  }
}
