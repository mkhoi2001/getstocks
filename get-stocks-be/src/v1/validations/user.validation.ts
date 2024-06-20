import Joi from 'joi'
import { LangI18n } from '../utils/const'

export const userValidate = {
  login: (data: any) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'any.required': LangI18n.__('email_required'),
          'string.email': LangI18n.__('email_is_invalid'),
          'string.empty': LangI18n.__('email_required')
        }),
      password: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('password_required'),
          'string.empty': LangI18n.__('password_required')
        })
    })

    return schema.validate(data)
  },
  signUp: (data: any) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'any.required': LangI18n.__('email_required'),
          'string.email': LangI18n.__('email_is_invalid'),
          'string.empty': LangI18n.__('email_required')
        }),
      password: Joi.string()
        .required()
        .min(6)
        .messages({
          'any.required': LangI18n.__('password_required'),
          'string.empty': LangI18n.__('password_required'),
          'string.min': LangI18n.__('password_min_6')
        }),
      username: Joi.string()
        .required()
        .min(6)
        .messages({
          'any.required': LangI18n.__('username_required'),
          'string.empty': LangI18n.__('username_required'),
          'string.min': LangI18n.__('username_min_6')
        })
    })

    return schema.validate(data)
  },

  forgotPassword: (data: any) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'any.required': LangI18n.__('email_required'),
          'string.email': LangI18n.__('email_is_invalid'),
          'string.empty': LangI18n.__('email_required')
        })
    })

    return schema.validate(data)
  },

  verifyForgotPassword: (data: any) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'any.required': LangI18n.__('email_required'),
          'string.email': LangI18n.__('email_is_invalid'),
          'string.empty': LangI18n.__('email_required')
        }),
      token: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('token_required'),
          'string.empty': LangI18n.__('token_required')
        })
    })

    return schema.validate(data)
  },

  passwordReset: (data: any) => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'any.required': LangI18n.__('email_required'),
          'string.email': LangI18n.__('email_is_invalid'),
          'string.empty': LangI18n.__('email_required')
        }),
      password: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('password_required'),
          'string.empty': LangI18n.__('password_required')
        })
    })

    return schema.validate(data)
  }
}

export default { userValidate }
