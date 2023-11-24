/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractConfig } from './config.schema';
import { Relation } from '../interface/relation.interface';
import {
  SearchEgineOperators,
  SearchEngine
} from '../interface/search-engine.interface';

export type AnimalDocument = Animal & Document;

@Schema({ timestamps: true, collection: 'animals' })
export class Animal extends AbstractConfig {
  @Prop({ required: true })
  idGroup: string;

  @Prop({ required: false })
  exotic: boolean;
}

const schema = SchemaFactory.createForClass(Animal);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });
export const AnimalsSchema = schema;

export const AnimalRelations: Relation[] = [
  {
    key: 'idGroup',
    service: 'animalGroups'
  }
];

export const AnimalSearchEngine: SearchEngine[] = [
  { key: 'name', operator: SearchEgineOperators.LIKE },
  { key: 'key', operator: SearchEgineOperators.LIKE },
  { key: 'idGroup', operator: SearchEgineOperators.IN }
];
