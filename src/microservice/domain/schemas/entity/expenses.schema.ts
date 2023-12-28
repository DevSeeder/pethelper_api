/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractSchema } from '../abstract.schema';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true, collection: DependencyEntityTokens.EXPENSE })
export class Expense extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  idCategory: string;

  @Prop({ required: false })
  cost: number;

  @Prop({ required: false, default: 1 })
  qtd: number;

  @Prop({ required: true })
  pets: string[];

  @Prop({ required: false })
  date: Date;

  @Prop({ required: true })
  userId: string;
}

const schema = SchemaFactory.createForClass(Expense);
export const ExpensesSchema = schema;
