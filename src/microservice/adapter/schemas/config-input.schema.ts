import * as Joi from 'joi';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { commonSearchSchema } from './abstract-input.schema';

const search = Joi.object({
  ...commonSearchSchema,
  name: Joi.string().optional(),
  key: Joi.string().optional()
});

const bodySchema = {
  date: Joi.date().optional(),
  cost: Joi.number().optional(),
  qtd: Joi.number().optional()
};

const update = Joi.object({
  ...bodySchema,
  name: Joi.string().optional(),
  key: Joi.string().optional()
});

const create = Joi.object({
  ...bodySchema,
  name: Joi.string().required(),
  key: Joi.string().required()
});

export const ConfigInputSchema: InputSchema = {
  search,
  create,
  update
};
