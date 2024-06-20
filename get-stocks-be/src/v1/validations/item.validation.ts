import Joi from 'joi'
import { LangI18n } from '../utils/const'

export const itemValidate = {
  validateLink: (data: any) => {
    const schema = Joi.object({
      link: Joi.string()
        .uri()
        .required()
        .messages({
          'any.required': LangI18n.__('link_required'),
          'string.empty': LangI18n.__('link_required'),
          'string.uri': LangI18n.__('link_invalid')
        })
    })

    return schema.validate(data)
  },
  validateLinkInfo: (data: any) => {
    const schema = Joi.object({
      link: Joi.string()
        .uri()
        .required()
        .messages({
          'any.required': LangI18n.__('link_required'),
          'string.empty': LangI18n.__('link_required'),
          'string.uri': LangI18n.__('link_invalid')
        }),
      type: Joi.string()
        .valid('G', 'P')
        .required()
        .messages({
          'any.required': LangI18n.__('type_item_required'),
          'string.empty': LangI18n.__('type_item_required'),
          'any.only': LangI18n.__('type_item_invalid')
        })
    })

    return schema.validate(data)
  },
  validateItemDown: (data: any) => {
    const schema = Joi.object({
      code: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('itemDcode_required'),
          'string.empty': LangI18n.__('itemDcode_required')
        }),
      apikey: Joi.string().optional()
    })

    return schema.validate(data)
  },
  validateCode: (data: any) => {
    const schema = Joi.object({
      code: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('itemDcode_required'),
          'string.empty': LangI18n.__('itemDcode_required')
        })
    })

    return schema.validate(data)
  },
  validateDownload: (data: any) => {
    const schema = Joi.object({
      link: Joi.string()
        .uri()
        .required()
        .messages({
          'any.required': LangI18n.__('link_required'),
          'string.empty': LangI18n.__('link_required'),
          'string.uri': LangI18n.__('link_invalid')
        }),
      type: Joi.string()
        .valid('G', 'P')
        .required()
        .messages({
          'any.required': LangI18n.__('type_item_required'),
          'string.empty': LangI18n.__('type_item_required'),
          'any.only': LangI18n.__('type_item_invalid')
        })
    })

    return schema.validate(data)
  },
  validateDownloadG: (data: any) => {
    const schema = Joi.object({
      link: Joi.string()
        .uri()
        .required()
        .messages({
          'any.required': LangI18n.__('link_required'),
          'string.empty': LangI18n.__('link_required'),
          'string.uri': LangI18n.__('link_invalid')
        }),
      type: Joi.string()
        .valid('G')
        .required()
        .messages({
          'any.required': LangI18n.__('type_item_required'),
          'string.empty': LangI18n.__('type_item_required'),
          'any.only': LangI18n.__('type_item_invalid')
        })
    })

    return schema.validate(data)
  },
  validateDownloadP: (data: any) => {
    const schema = Joi.object({
      link: Joi.string()
        .uri()
        .required()
        .messages({
          'any.required': LangI18n.__('link_required'),
          'string.empty': LangI18n.__('link_required'),
          'string.uri': LangI18n.__('link_invalid')
        }),
      type: Joi.string()
        .valid('P')
        .required()
        .messages({
          'any.required': LangI18n.__('type_item_required'),
          'string.empty': LangI18n.__('type_item_required'),
          'any.only': LangI18n.__('type_item_invalid')
        })
    })
    return schema.validate(data)
  },
  validateId: (data: any) => {
    const schema = Joi.object({
      id: Joi.string()
        .required()
        .messages({
          'any.required': LangI18n.__('itemDcode_required'),
          'string.empty': LangI18n.__('itemDcode_required')
        })
    })

    return schema.validate(data)
  }
}

export default itemValidate
