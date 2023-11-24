import * as Joi from 'joi';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';
import { commonSearchSchema } from './abstract-input.schema';

const commonSchema = {
  color: Joi.string().optional(),
  sex: Joi.string()
    .optional()
    .custom(SchemaValidator.validateEnum(['M', 'F']))
};

const search = Joi.object({
  ...commonSearchSchema,
  ...commonSchema,
  name: Joi.string().optional(),
  idAnimal: Joi.string().optional(),
  race: Joi.string().optional(),
  active: Joi.boolean().optional()
});

const bodySchema = {
  ...commonSchema,
  birthDate: Joi.date().optional(),
  races: Joi.array<string>().optional(),
  weight: Joi.number().optional(),
  height: Joi.number().optional()
};

const update = Joi.object({
  ...bodySchema,
  name: Joi.string().optional(),
  idAnimal: Joi.string().optional()
});

const create = Joi.object({
  ...bodySchema,
  userId: Joi.string().required(),
  name: Joi.string().required(),
  idAnimal: Joi.string().required()
});

export const PetInputSchema: InputSchema = {
  search,
  create,
  update
};
