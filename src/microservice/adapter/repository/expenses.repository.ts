import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Expense,
  ExpenseDocument
} from 'src/microservice/domain/schemas/expenses.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class ExpensesRepository extends AbstractRepository<
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
