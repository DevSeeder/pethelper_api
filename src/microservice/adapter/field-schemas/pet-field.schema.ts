import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { commonFieldSchema } from './abstract-input.schema';

export const PetFieldSchema: FieldItemSchema[] = [
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
    key: 'idAnimal',
    required: true,
    type: 'externalId',
    externalRelation: {
      service: 'animals'
    },
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.IN]
  },
  {
    key: 'races',
    required: false,
    array: true,
    type: 'externalId',
    itensType: 'string',
    externalRelation: {
      service: 'races'
    },
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.IN],
    alias: {
      search: 'race'
    }
  },
  {
    key: 'color',
    required: false,
    type: 'externalId',
    externalRelation: {
      service: 'colors'
    },
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.IN]
  },
  {
    key: 'sex',
    required: false,
    enumValues: ['M', 'F'],
    type: 'enum',
    itensType: 'string',
    hidden: false,
    allowed: {
      search: true,
      update: true
    }
  },
  {
    key: 'weight',
    required: false,
    type: 'double',
    hidden: false,
    allowed: {
      search: false,
      update: true
    }
  },
  {
    key: 'height',
    required: false,
    type: 'double',
    hidden: false,
    allowed: {
      search: false,
      update: true
    }
  },
  {
    key: 'birthDate',
    required: false,
    type: 'date',
    hidden: false,
    allowed: {
      search: false,
      update: true
    }
  },
  {
    key: 'userId',
    required: true,
    type: 'externalId',
    externalRelation: {
      service: 'users'
    },
    hidden: true,
    allowed: {
      search: false,
      update: false
    }
  }
];
