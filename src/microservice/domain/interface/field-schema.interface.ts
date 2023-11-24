export interface FieldSchema {
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
  max?: number;
  min?: number;
  hidden?: boolean;
  externalRelation?: {
    service: string;
  };
}
