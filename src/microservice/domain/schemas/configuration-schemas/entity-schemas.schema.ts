/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from '../abstract.schema';
import { PROJECT_KEY } from 'src/microservice/application/app.constants';

export type EntitySchemaDocument = EntitySchema & Document;

@Schema({ timestamps: true, collection: 'entitySchemas' })
export class EntitySchema extends AbstractSchema {
  @Prop({ required: true, default: PROJECT_KEY })
  projectKey: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  collectionName: string;

  @Prop({ required: true })
  service: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true, default: [] })
  subRelations: Array<SubRelation> = [];

  @Prop({ required: false, default: [] })
  extendedEntities: Array<string> = [];

  @Prop({ required: false, default: [] })
  forbiddenMethods: Array<string> = [];

  @Prop({ required: true })
  itemLabel: string;

  @Prop({ required: false, default: '' })
  searchKey: string;

  @Prop({ required: true })
  hidden: boolean;

  @Prop({ required: false, default: 1000 })
  order: number;
}

export interface SubRelation {
  entity: string;
  service: string;
  key: string;
  nameKey?: string;
  label: string;
  clone?: boolean;
  array?: boolean;
}

const schema = SchemaFactory.createForClass(EntitySchema);
schema.index({ projectKey: 1, entity: 1 }, { unique: true });
export const EntitySchemasSchema = schema;
