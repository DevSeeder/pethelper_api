import { SearchEgineOperators } from './search-engine.interface';
import { Validation } from './validation.interface';

export interface FieldSchemaResponse {
  fields: Array<FieldItemSchema & FormFieldResponse>;
  filterOptions?: {
    orderBy?: FieldOrder[];
  };
  cloneRelations?: string[];
}

export interface FieldItemSchema {
  key: string;
  allowed: {
    update: boolean;
    search: boolean;
  };
  type: string;
  required: boolean;
  array?: boolean;
  enumValues?: Array<string | number>;
  itensType?: 'string' | 'number';
  searchEgines?: SearchEgineOperators[];
  max?: number;
  min?: number;
  hidden?: boolean;
  externalRelation?: {
    service: string;
  };
  alias?: {
    search?: string;
  };
  label: string;
  order?: number;
  orderBy?: boolean;
  entity?: string;
  validations?: Validation[];
}

export interface FormFieldResponse {
  projectKey?: string;
  entity?: string;
  values?: FieldValue[];
}

export interface FieldValue {
  id: string;
  value: any;
}

export interface FieldOrder {
  label: string;
  key: string;
}

export enum FieldSchemaPage {
  SEARCH = 'search',
  UPDATE = 'update',
  CREATE = 'create'
}
