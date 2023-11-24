import * as Joi from 'joi';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { commonSearchSchema } from './abstract-input.schema';

const search = Joi.object({
  ...commonSearchSchema,
  name: Joi.string().optional(),
  key: Joi.string().optional(),
  idGroup: Joi.string().optional(),
  exotic: Joi.boolean().optional()
});

const bodySchema = {
  exotic: Joi.boolean().optional()
};

const update = Joi.object({
  ...bodySchema,
  name: Joi.string().optional(),
  key: Joi.string().optional(),
  idGroup: Joi.string().optional()
});

const create = Joi.object({
  ...bodySchema,
  name: Joi.string().required(),
  key: Joi.string().required(),
  idGroup: Joi.string().required()
});

export const AnimalInputSchema: InputSchema = {
  search,
  create,
  update
};
