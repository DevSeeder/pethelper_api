import * as Joi from 'joi';

export const commonSearchSchema = {
  page: Joi.number().min(1).optional(),
  pageSize: Joi.number().min(1).optional(),
  orderBy: Joi.string().optional(),
  orderMode: Joi.string().optional(),
  select: Joi.string().optional(),
  _ids: Joi.string().optional()
};

export const singleCloneSchema = {
  cloneRelations: Joi.array<string>().optional()
};

export const commonFieldSchema = [
  {
    key: 'active',
    required: false,
    type: 'boolean',
    hidden: true,
    allowed: {
      search: true,
      update: false
    }
  }
];
