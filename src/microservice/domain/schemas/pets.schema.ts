/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Relation } from '../interface/relation.interface';
import {
  SearchEgineOperators,
  SearchEngine
} from '../interface/search-engine.interface';
import { AbstractSchema } from './abstract.schema';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true, collection: 'pets' })
export class Pet extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sex: 'M' | 'F';

  @Prop({ required: false })
  birthDate: string;

  @Prop({ required: false })
  color: string;

  @Prop({ required: false })
  weight: number;

  @Prop({ required: false })
  height: number;

  @Prop({ required: true })
  idAnimal: string;

  @Prop({ required: false })
  races: string[];

  @Prop({ required: true })
  userId: string;
}

const schema = SchemaFactory.createForClass(Pet);
export const PetsSchema = schema;
