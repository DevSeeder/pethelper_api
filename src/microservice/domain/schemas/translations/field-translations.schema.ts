/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractTranslation } from './abstract-translation.schema';

export type FieldTranslationDocument = FieldTranslation & Document;

@Schema({ timestamps: true, collection: 'fieldTranslations' })
export class FieldTranslation extends AbstractTranslation {
  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  fieldLabel: string;

  @Prop({ required: false })
  fieldPlaceholder?: string;

  @Prop({ required: false })
  fieldTooltip?: string;
}

const schema = SchemaFactory.createForClass(FieldTranslation);
schema.index({ projectKey: 1, entity: 1, key: 1, locale: 1 }, { unique: true });
export const FieldTranslationsSchema = schema;
