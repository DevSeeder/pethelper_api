/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RaceDocument = Race & Document;

@Schema({ timestamps: true, collection: 'races' })
export class Race {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  active: boolean;
}

const schema = SchemaFactory.createForClass(Race);
schema.index({ name: 1 });
export const RacesSchema = schema;
