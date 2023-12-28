/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from '../abstract.schema';
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
