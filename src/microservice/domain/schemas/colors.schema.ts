/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractConfig } from './config.schema';

export type ColorDocument = Color & Document;

@Schema({ timestamps: true, collection: 'colors' })
export class Color extends AbstractConfig {}

const schema = SchemaFactory.createForClass(Color);
schema.index({ name: 1 });
schema.index({ key: 1 });

export const ColorsSchema = schema;
