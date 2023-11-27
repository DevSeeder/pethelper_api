import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { commonFieldSchema } from './abstract-input.schema';

export const ConfigFieldSchema: FieldItemSchema[] = [
  ...commonFieldSchema,
  {
    key: 'name',
    required: true,
    type: 'text',
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.LIKE]
  },
  {
    key: 'key',
    required: true,
    type: 'text',
    hidden: true,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.LIKE]
  }
];
