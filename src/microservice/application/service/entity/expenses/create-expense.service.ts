import { Inject, Injectable } from '@nestjs/common';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';
import {
  Expense,
  ExpenseDocument
} from '../../../../domain/schemas/entity/expenses.schema';
import { ExpenseResponse } from '../../../dto/response/expense.response';
import { ExpenseBodyDto } from '../../../dto/body/expense-body.dto';
import { GetPetService } from '../pets/get-pet.service';
import { GetExpenseCategoriesService } from '../expense-categories/get-expense-category.service';
import { GetUserService } from '../users/get-user.service';
import { AbstractCreateService } from '../../abstract/abstract-create.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class CreateExpenseService extends AbstractCreateService<
  Expense,
  ExpenseDocument,
  ExpenseResponse,
  ExpenseBodyDto
> {
  constructor(
    protected readonly repository: ExpensesRepository,
    protected readonly getPetsService: GetPetService,
    protected readonly getExpenseCategoriesService: GetExpenseCategoriesService,
    protected readonly getUsersService: GetUserService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, 'expenses', fieldSchemaData, entitySchemaData);
  }
}
