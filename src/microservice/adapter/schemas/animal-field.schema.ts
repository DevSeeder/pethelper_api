import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { ConfigFieldSchema } from './config-field.schema';

export const AnimalFieldSchema: FieldItemSchema[] = [
  ...ConfigFieldSchema,
  {
    key: 'idGroup',
    required: true,
    type: 'externalId',
    externalRelation: {
      service: 'animalGroups'
    },
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.IN]
  }
];
