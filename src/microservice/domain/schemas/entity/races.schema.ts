/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDomain } from './domain.schema';

export type RaceDocument = Race & Document;

@Schema({ timestamps: true, collection: 'races' })
export class Race extends AbstractDomain {}

const schema = SchemaFactory.createForClass(Race);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const RacesSchema = schema;
