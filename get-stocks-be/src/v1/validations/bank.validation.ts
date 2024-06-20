import Joi from 'joi'
import { LangI18n } from '../utils/const'

export const bankValidate = {
  create: (data: any) => {
    const schema = Joi.object({
      bankName: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('bank_required'),
          'string.empty': LangI18n.__('bank_required')
        }),
      cardNumber: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('cardNumber_required'),
          'string.empty': LangI18n.__('cardNumber_required')
        }),
      username: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('username_bank_required'),
          'string.empty': LangI18n.__('username_bank_required')
        })
    })

    return schema.validate(data)
  }
}

export default bankValidate
