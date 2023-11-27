/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractConfig } from './config.schema';
export type ExpenseCategoryDocument = ExpenseCategory & Document;

@Schema({ timestamps: true, collection: 'expenseCategories' })
export class ExpenseCategory extends AbstractConfig {}

const schema = SchemaFactory.createForClass(ExpenseCategory);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const ExpenseCategoriesSchema = schema;
