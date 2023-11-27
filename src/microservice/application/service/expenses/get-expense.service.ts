import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { ExpensesRepository } from 'src/microservice/adapter/repository/expenses.repository';
import {
  Expense,
  ExpenseDocument,
  ExpenseRelations
} from '../../../domain/schemas/expenses.schema';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-expense.dto';
import { GetUserService } from '../users/get-user.service';
import { GetPetService } from '../pets/get-pet.service';
import { GetExpenseCategoriesService } from '../expense-categories/get-expense-category.service';
import { ExpenseFieldSchema } from 'src/microservice/adapter/field-schemas/expense-field.schema';

@Injectable()
export class GetExpenseService extends AbstractGetService<
  Expense,
  ExpenseDocument,
  ExpenseResponse,
  SearchExpenseDto
> {
  constructor(
    protected readonly repository: ExpensesRepository,
    protected readonly petsService: GetPetService,
    protected readonly usersService: GetUserService,
    protected readonly expenseCategoriesService: GetExpenseCategoriesService
  ) {
    super(repository, 'Expense', ExpenseRelations, ExpenseFieldSchema);
  }
}
