/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from './abstract.schema';
import { SearchEgineOperators } from '../interface/search-engine.interface';
import { PROJECT_KEY } from 'src/microservice/application/app.constants';

export type FieldSchemaDocument = FieldSchema & Document;

@Schema({ timestamps: true, collection: 'fieldSchemas' })
export class FieldSchema extends AbstractSchema {
  @Prop({ required: true, default: PROJECT_KEY })
  projectKey: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true, type: Object })
  allowed: {
    update: boolean;
    search: boolean;
  };

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  required: boolean;

  @Prop({ required: false })
  array?: boolean;

  @Prop({ required: false })
  enumValues?: Array<string | number>;

  @Prop({ required: false })
  itensType?: 'string' | 'number';

  @Prop({ required: false })
  searchEgines?: SearchEgineOperators[];

  @Prop({ required: false })
  max?: number;

  @Prop({ required: false })
  min?: number;

  @Prop({ required: false })
  hidden?: boolean;

  @Prop({ required: false, type: Object })
  externalRelation?: {
    service: string;
  };

  @Prop({ required: false, type: Object })
  alias?: {
    search?: string;
  };
}

const schema = SchemaFactory.createForClass(FieldSchema);
schema.index({ key: 1, projectKey: 1, entity: 1 }, { unique: true });
export const FieldSchemasSchema = schema;
