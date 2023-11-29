import { ObjectSchema } from 'joi';

export interface InputSchema {
  search?: ObjectSchema;
  update?: ObjectSchema;
  create?: ObjectSchema;
  cloneOne?: ObjectSchema;
  cloneMany?: ObjectSchema;
}
