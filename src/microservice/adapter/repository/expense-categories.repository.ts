import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/expense-categories.schema';

@Injectable()
export class ExpenseCategoriesRepository extends MongooseRepository<
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
