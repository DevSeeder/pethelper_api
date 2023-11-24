import { Controller } from '@nestjs/common';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-Expense.dto';
import { GetExpenseService } from 'src/microservice/application/service/expenses/get-Expense.service';
import { AbstractController } from './abstract.controller';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import {
  Expense,
  ExpenseDocument
} from 'src/microservice/domain/schemas/expenses.schema';
import { ExpenseInputSchema } from '../schemas/expense-input.schema';

@Controller('expenses')
export class ExpensesController extends AbstractController<
  Expense,
  ExpenseDocument,
  ExpenseResponse,
  SearchExpenseDto,
  any
> {
  constructor(protected readonly getService: GetExpenseService) {
    super(
      getService,
      'pets',
      null,
      ExpenseInputSchema,
      'Expense'
      // updateService
    );
  }
}
