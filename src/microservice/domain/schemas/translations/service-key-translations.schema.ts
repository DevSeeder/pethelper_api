/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractTranslation } from './abstract-translation.schema';

export type ServiceKeyTranslationDocument = ServiceKeyTranslation & Document;

@Schema({ timestamps: true, collection: 'serviceKeyTranslations' })
export class ServiceKeyTranslation extends AbstractTranslation {
  @Prop({ required: true })
  type: string;

  @Prop({ required: false })
  description?: string;
}

const schema = SchemaFactory.createForClass(ServiceKeyTranslation);
schema.index({ projectKey: 1, key: 1, locale: 1, type: 1 }, { unique: true });
export const ServiceKeyTranslationsSchema = schema;
