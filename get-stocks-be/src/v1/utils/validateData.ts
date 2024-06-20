import { Response } from 'express'
import Joi from 'joi'

export const validateData = async (func: (data: any) => Joi.ValidationResult<any>, data: any, res: Response) => {
  const { error } = func(data)
  if (error) {
    console.log('validate:: ', error.details)
    const errorMessages = error.details.map((err) => ({ message: err.message, key: err?.context?.key }))
    // console.log('errorMessages ', errorMessages)
    return res.status(422).json({ status: 422, message: error.details[0].message })
  }
}
