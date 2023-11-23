/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Relation } from '../interface/relation.interface';
import {
  SearchEgineOperators,
  SearchEngine
} from '../interface/search-engine.interface';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true, collection: 'pets' })
export class Pet {
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

  @Prop({ required: true })
  active: boolean;
}

const schema = SchemaFactory.createForClass(Pet);
export const PetsSchema = schema;

export const PetRelations: Relation[] = [
  {
    key: 'color',
    service: 'colors'
  },
  {
    key: 'idAnimal',
    service: 'animals'
  },
  {
    key: 'races',
    service: 'races'
  }
];

export const PetSearchEngine: SearchEngine[] = [
  { key: 'name', operator: SearchEgineOperators.LIKE },
  { key: 'color', operator: SearchEgineOperators.IN },
  { key: 'idAnimal', operator: SearchEgineOperators.IN },
  { key: 'races', operator: SearchEgineOperators.IN }
];
