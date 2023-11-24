import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';

export const PetFieldSchema: FieldItemSchema[] = [
  {
    key: 'name',
    required: true,
    type: 'text',
    hidden: false,
    allowed: {
      search: true,
      update: true
    }
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
    }
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
    }
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
    key: 'active',
    required: false,
    type: 'boolean',
    hidden: true,
    allowed: {
      search: true,
      update: false
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
