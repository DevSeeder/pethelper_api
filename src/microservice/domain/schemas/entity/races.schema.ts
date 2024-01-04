/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractDomain } from '@devseeder/nestjs-microservices-commons';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';

export type RaceDocument = Race & Document;

@Schema({ timestamps: true, collection: DependencyEntityTokens.RACE })
export class Race extends AbstractDomain {}

const schema = SchemaFactory.createForClass(Race);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const RacesSchema = schema;
