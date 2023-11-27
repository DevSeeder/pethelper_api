/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Relation } from '../interface/relation.interface';
import {
  SearchEgineOperators,
  SearchEngine
} from '../interface/search-engine.interface';
import { AbstractSchema } from './abstract.schema';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true, collection: 'expenses' })
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

export const ExpenseRelations: Relation[] = [
  {
    key: 'idCategory',
    service: 'expenseCategories'
  },
  {
    key: 'pets',
    service: 'pets'
  },
  {
    key: 'userId',
    service: 'users'
  }
];
