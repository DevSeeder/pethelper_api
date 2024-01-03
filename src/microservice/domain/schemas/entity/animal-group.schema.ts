/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDomain } from '../../../../../../nestjs-microservices-commons/src/schema/domain.schema';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';

export type AnimalGroupDocument = AnimalGroup & Document;

@Schema({ timestamps: true, collection: DependencyEntityTokens.ANIMAL_GROUP })
export class AnimalGroup extends AbstractDomain {
  @Prop({ required: true })
  idType: string;
}

const schema = SchemaFactory.createForClass(AnimalGroup);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const AnimalGroupsSchema = schema;
