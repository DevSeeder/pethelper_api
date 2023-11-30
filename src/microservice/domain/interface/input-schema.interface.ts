import { ObjectSchema } from 'joi';

export interface InputSchema {
  search?: ObjectSchema;
  count?: ObjectSchema;
  update?: ObjectSchema;
  create?: ObjectSchema;
  cloneOne?: ObjectSchema;
  cloneMany?: ObjectSchema;
}
