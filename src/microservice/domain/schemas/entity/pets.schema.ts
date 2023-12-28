/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from '../abstract.schema';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true, collection: DependencyEntityTokens.PET })
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
