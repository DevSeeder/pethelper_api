/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractConfig } from './config.schema';

export type RaceDocument = Race & Document;

@Schema({ timestamps: true, collection: 'races' })
export class Race extends AbstractConfig {}

const schema = SchemaFactory.createForClass(Race);
schema.index({ name: 1 });
schema.index({ key: 1 });

export const RacesSchema = schema;
