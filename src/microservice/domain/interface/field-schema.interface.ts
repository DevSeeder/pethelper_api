import { SearchEgineOperators } from './search-engine.interface';

export interface FieldSchemaResponse {
  fields: FieldItemSchema[];
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
}
