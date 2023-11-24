/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractConfig } from './config.schema';

export type AnimalTypeDocument = AnimalType & Document;

@Schema({ timestamps: true, collection: 'animalType' })
export class AnimalType extends AbstractConfig {}

const schema = SchemaFactory.createForClass(AnimalType);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const AnimalTypesSchema = schema;
