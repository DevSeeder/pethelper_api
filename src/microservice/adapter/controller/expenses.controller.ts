import { Controller } from '@nestjs/common';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-Expense.dto';
import { GetExpenseService } from 'src/microservice/application/service/expenses/get-Expense.service';
import { AbstractController } from './abstract.controller';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import {
  Expense,
  ExpenseDocument
} from 'src/microservice/domain/schemas/expenses.schema';
import { UpdateExpenseService } from 'src/microservice/application/service/expenses/update-expense.service';
import { ExpenseBodyDto } from 'src/microservice/application/dto/body/expense-body.dto';
import { CreateExpenseService } from 'src/microservice/application/service/expenses/create-expense.service';
import { ExpenseFieldSchema } from '../field-schemas/expense-field.schema';

@Controller('expenses')
export class ExpensesController extends AbstractController<
  Expense,
  ExpenseDocument,
  ExpenseResponse,
  SearchExpenseDto,
  ExpenseBodyDto
> {
  constructor(
    protected readonly getService: GetExpenseService,
    protected readonly updateService: UpdateExpenseService,
    protected readonly createService: CreateExpenseService
  ) {
    super(
      getService,
      'pets',
      ExpenseFieldSchema,
      'Expense',
      [],
      updateService,
      createService
    );
  }
}
