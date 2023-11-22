/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalDocument = Animal & Document;

@Schema({ timestamps: true, collection: 'animals' })
export class Animal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  active: boolean;
}

const schema = SchemaFactory.createForClass(Animal);
schema.index({ name: 1 });
export const AnimalsSchema = schema;
