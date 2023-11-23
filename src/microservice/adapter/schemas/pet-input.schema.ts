import * as Joi from 'joi';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';
import { InputSchema } from 'src/microservice/domain/interface/input-schema.interface';

const commonSchema = {
  name: Joi.string().optional(),
  color: Joi.string().optional(),
  sex: Joi.string()
    .optional()
    .custom(SchemaValidator.validateEnum(['M', 'F'])),
  idAnimal: Joi.string().optional()
};

const search = Joi.object({
  ...commonSchema,
  race: Joi.string().optional(),
  active: Joi.boolean().optional()
});

const bodySchema = Joi.object({
  ...commonSchema,
  birthDate: Joi.date().optional(),
  races: Joi.array<string>().optional(),
  weight: Joi.number().optional(),
  height: Joi.number().optional()
});

export const PetInputSchema: InputSchema = {
  search,
  create: bodySchema,
  update: bodySchema
};
