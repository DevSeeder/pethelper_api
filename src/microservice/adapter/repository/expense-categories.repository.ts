import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/expense-categories.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class ExpenseCategoriesRepository extends AbstractRepository<
  ExpenseCategory,
  ExpenseCategoryDocument
> {
  constructor(
    @InjectModel(ExpenseCategory.name)
    model: Model<ExpenseCategoryDocument>
  ) {
    super(model);
  }
}
