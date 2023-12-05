/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDomain } from './domain.schema';

export type AnimalDocument = Animal & Document;

@Schema({ timestamps: true, collection: 'animals' })
export class Animal extends AbstractDomain {
  @Prop({ required: true })
  idGroup: string;

  @Prop({ required: false })
  exotic: boolean;
}

const schema = SchemaFactory.createForClass(Animal);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });
export const AnimalsSchema = schema;
