/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDomain } from '../../../../../../nestjs-microservices-commons/src/schema/domain.schema';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';
export type ExpenseCategoryDocument = ExpenseCategory & Document;

@Schema({
  timestamps: true,
  collection: DependencyEntityTokens.EXPENSE_CATEGORY
})
export class ExpenseCategory extends AbstractDomain {}

const schema = SchemaFactory.createForClass(ExpenseCategory);
schema.index({ name: 1 }, { unique: true });
schema.index({ key: 1 }, { unique: true });

export const ExpenseCategoriesSchema = schema;
