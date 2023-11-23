/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from './abstract.schema';

export type ColorDocument = Color & Document;

@Schema({ timestamps: true, collection: 'colors' })
export class Color extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;
}

const schema = SchemaFactory.createForClass(Color);
schema.index({ name: 1 });
export const ColorsSchema = schema;
