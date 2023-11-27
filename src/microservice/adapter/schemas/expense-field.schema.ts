import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';
import { SearchEgineOperators } from 'src/microservice/domain/interface/search-engine.interface';
import { commonFieldSchema } from './abstract-input.schema';

export const ExpenseFieldSchema: FieldItemSchema[] = [
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
    key: 'description',
    required: false,
    type: 'text',
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.LIKE]
  },
  {
    key: 'idCategory',
    required: true,
    type: 'externalId',
    externalRelation: {
      service: 'expenseCategories'
    },
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.IN]
  },
  {
    key: 'pets',
    required: false,
    array: true,
    type: 'externalId',
    itensType: 'string',
    externalRelation: {
      service: 'pets'
    },
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.IN]
  },
  {
    key: 'cost',
    required: false,
    type: 'double',
    hidden: false,
    allowed: {
      search: false,
      update: true
    }
  },
  {
    key: 'qtd',
    required: false,
    type: 'integer',
    hidden: false,
    allowed: {
      search: false,
      update: true
    }
  },
  {
    key: 'date',
    required: false,
    type: 'date',
    hidden: false,
    allowed: {
      search: true,
      update: true
    },
    searchEgines: [SearchEgineOperators.BETWEEN]
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
