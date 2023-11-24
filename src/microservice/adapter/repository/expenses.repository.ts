import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  Expense,
  ExpenseDocument
} from 'src/microservice/domain/schemas/expenses.schema';

@Injectable()
export class ExpensesRepository extends MongooseRepository<
  Expense,
  ExpenseDocument
> {
  constructor(
    @InjectModel(Expense.name)
    model: Model<ExpenseDocument>
  ) {
    super(model);
  }
}
