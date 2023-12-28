/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDomain } from './domain.schema';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';

export type AnimalTypeDocument = AnimalType & Document;

@Schema({ timestamps: true, collection: DependencyEntityTokens.ANIMAL_TYPE })
export class AnimalType extends AbstractDomain {}

const schema = SchemaFactory.createForClass(AnimalType);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const AnimalTypesSchema = schema;
