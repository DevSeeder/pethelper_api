/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractConfig } from './config.schema';

export type AnimalGroupDocument = AnimalGroup & Document;

@Schema({ timestamps: true, collection: 'animalGroups' })
export class AnimalGroup extends AbstractConfig {}

const schema = SchemaFactory.createForClass(AnimalGroup);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const AnimalGroupsSchema = schema;
