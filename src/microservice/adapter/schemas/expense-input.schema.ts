import * as Joi from 'joi';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { commonSearchSchema } from './abstract-input.schema';

const commonSchema = {
  description: Joi.string().optional()
};

const search = Joi.object({
  ...commonSearchSchema,
  ...commonSchema,
  name: Joi.string().optional(),
  idCategory: Joi.string().optional(),
  date_start: Joi.date().optional(),
  date_end: Joi.date().optional(),
  active: Joi.boolean().optional(),
  pets: Joi.string().optional()
});

const bodySchema = {
  ...commonSchema,
  date: Joi.date().optional(),
  cost: Joi.number().optional(),
  qtd: Joi.number().optional()
};

const update = Joi.object({
  ...bodySchema,
  name: Joi.string().optional(),
  idCategory: Joi.string().optional(),
  pets: Joi.array<string>().optional()
});

const create = Joi.object({
  ...bodySchema,
  name: Joi.string().required(),
  idCategory: Joi.string().required(),
  userId: Joi.string().required(),
  pets: Joi.array<string>().required()
});

export const ExpenseInputSchema: InputSchema = {
  search,
  create,
  update
};
