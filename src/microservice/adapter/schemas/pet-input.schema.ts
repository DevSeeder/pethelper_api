import * as Joi from 'joi';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';

const search = Joi.object({
  name: Joi.string().optional(),
  sex: Joi.string()
    .optional()
    .custom(SchemaValidator.validateEnum(['M', 'F'])),
  userId: Joi.string().optional(),
  idAnimal: Joi.string().optional(),
  race: Joi.string().optional(),
  active: Joi.boolean().optional()
});

export const PetInputSchema = {
  search
};
