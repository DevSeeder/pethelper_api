import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { GenericRepository } from '../generic.repository';

@Injectable()
export class ExpenseCategoriesRepository extends GenericRepository<ExpenseCategory> {
  constructor(
    @InjectModel(ExpenseCategory.name)
    model: Model<ExpenseCategoryDocument>
  ) {
    super(model);
  }
}
