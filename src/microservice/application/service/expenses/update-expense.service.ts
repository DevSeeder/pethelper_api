import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from 'src/microservice/adapter/repository/expenses.repository';
import {
  Expense,
  ExpenseDocument,
  ExpenseRelations
} from '../../../domain/schemas/expenses.schema';
import { AbstractUpdateService } from '../abstract/abstract-update.service';
import { ExpenseResponse } from '../../dto/response/expense.response';
import { ExpenseBodyDto } from '../../dto/body/expense-body.dto';
import { GetPetService } from '../pets/get-pet.service';
import { GetExpenseCategoriesService } from '../expense-categories/get-expense-category.service';
import { GetUserService } from '../users/get-user.service';

@Injectable()
export class UpdateExpenseService extends AbstractUpdateService<
  Expense,
  ExpenseDocument,
  ExpenseResponse,
  ExpenseBodyDto
> {
  constructor(
    protected readonly repository: ExpensesRepository,
    protected readonly petsService: GetPetService,
    protected readonly expenseCategoriesService: GetExpenseCategoriesService,
    protected readonly usersService: GetUserService
  ) {
    super(repository, 'Expense', ExpenseRelations);
  }
}
