/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractSchema } from '@devseeder/nestjs-microservices-commons/dist/schema/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: DependencyEntityTokens.USER })
export class User extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: false })
  idUserAuth: string;
}

const schema = SchemaFactory.createForClass(User);
schema.index({ name: 1 }, { unique: true });
schema.index({ idUserAuth: 1 }, { unique: true });

export const UsersSchema = schema;
