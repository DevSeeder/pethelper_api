import { Inject, Injectable } from '@nestjs/common';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';
import {
  Expense,
  ExpenseDocument
} from '../../../../domain/schemas/entity/expenses.schema';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import { ExpenseResponse } from '../../../dto/response/expense.response';
import { ExpenseBodyDto } from '../../../dto/body/expense-body.dto';
import { GetPetService } from '../pets/get-pet.service';
import { GetExpenseCategoriesService } from '../expense-categories/get-expense-category.service';
import { GetUserService } from '../users/get-user.service';
import { SearchExpenseDto } from '../../../dto/search/search-Expense.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

@Injectable()
export class UpdateExpenseService extends AbstractUpdateService<
  Expense,
  ExpenseDocument,
  ExpenseResponse,
  ExpenseBodyDto,
  SearchExpenseDto
> {
  constructor(
    protected readonly repository: ExpensesRepository,
    protected readonly getPetsService: GetPetService,
    protected readonly getExpenseCategoriesService: GetExpenseCategoriesService,
    protected readonly getUsersService: GetUserService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(repository, 'Expense', ['expenses'], fieldSchemaData);
  }
}
