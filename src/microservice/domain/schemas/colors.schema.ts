/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractConfig } from './config.schema';

export type ColorDocument = Color & Document;

@Schema({ timestamps: true, collection: 'colors' })
export class Color extends AbstractConfig {}

const schema = SchemaFactory.createForClass(Color);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const ColorsSchema = schema;
