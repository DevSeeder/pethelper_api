/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from './abstract.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User extends AbstractSchema {
  @Prop({ required: false })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: false })
  idUserAuth: string;
}

const schema = SchemaFactory.createForClass(User);
schema.index({ name: 1 }, { unique: true });
schema.index({ id: 1 }, { unique: true });
schema.index({ idUserAuth: 1 }, { unique: true });

export const UsersSchema = schema;
