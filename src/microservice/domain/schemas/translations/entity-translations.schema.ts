/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractTranslation } from './abstract-translation.schema';

export type EntityTranslationDocument = EntityTranslation & Document;

@Schema({ timestamps: true, collection: 'entityTranslations' })
export class EntityTranslation extends AbstractTranslation {
  @Prop({ required: true })
  entityLabel: string;

  @Prop({ required: true })
  itemLabel: string;

  @Prop({ required: false })
  entityDescription?: string;
}

const schema = SchemaFactory.createForClass(EntityTranslation);
schema.index({ projectKey: 1, key: 1, locale: 1 }, { unique: true });
export const EntityTranslationsSchema = schema;
