import { Inject, Injectable } from '@nestjs/common';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';
import { Expense } from '../../../../domain/schemas/entity/expenses.schema';
import { GenericUpdateService } from '../../abstract/generic-update.service';
import { ExpenseResponse } from '../../../dto/response/expense.response';
import { ExpenseBodyDto } from '../../../dto/body/expense-body.dto';
import { GetPetService } from '../pets/get-pet.service';
import { GetUserService } from '../users/get-user.service';
import { SearchExpenseDto } from '../../../dto/search/search-Expense.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { GenericGetService } from '../../abstract/generic-get.service';
import { ExpenseCategory } from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { Search } from 'src/microservice/application/dto/search/search.dto';

@Injectable()
export class UpdateExpenseService extends GenericUpdateService<
  Expense,
  ExpenseResponse,
  ExpenseBodyDto,
  SearchExpenseDto
> {
  constructor(
    protected readonly repository: ExpensesRepository,
    protected readonly getPetsService: GetPetService,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.EXPENSE_CATEGORY}`)
    protected readonly getExpenseCategoriesService: GenericGetService<
      ExpenseCategory,
      ExpenseCategory,
      Search
    >,
    protected readonly getUsersService: GetUserService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(
      repository,
      'expenses',
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
