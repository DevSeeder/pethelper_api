/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from '../abstract.schema';
import { GLOBAL_ENTITY } from 'src/microservice/application/app.constants';
import { HttpStatus } from '@nestjs/common';
import { Translation } from '../entity/domain.schema';

export type EntitySchemaDocument = EntitySchema & Document;

@Schema({ timestamps: true, collection: 'entitySchemas' })
export class EntitySchema extends AbstractSchema {
  @Prop({ required: true, default: GLOBAL_ENTITY })
  projectKey: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  httpStatus: HttpStatus;

  @Prop({ required: true })
  code: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  translations: Translation[];
}

const schema = SchemaFactory.createForClass(EntitySchema);
schema.index({ projectKey: 1, name: 1 }, { unique: true });
schema.index({ projectKey: 1, key: 1 }, { unique: true });
schema.index({ projectKey: 1, code: 1 }, { unique: true });
export const EntitySchemasSchema = schema;
