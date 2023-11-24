import * as Joi from 'joi';

export const commonSearchSchema = {
  page: Joi.number().min(1).optional(),
  pageSize: Joi.number().min(1).optional()
};
