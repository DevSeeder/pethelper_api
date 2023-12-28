import { Controller, Get, Inject, Query } from '@nestjs/common';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-Expense.dto';
import { AbstractController } from '../abstract/abstract.controller';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import { Expense } from 'src/microservice/domain/schemas/entity/expenses.schema';
import { ExpenseBodyDto } from 'src/microservice/application/dto/body/expense-body.dto';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { GenericCreateService } from 'src/microservice/application/service/abstract/generic-create.service';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';
import { GroupExpensesByPetAndCategoryResponse } from 'src/microservice/application/dto/response/groupby/group-expenses-by-pet-and-category.response';
import { GetExpenseService } from 'src/microservice/application/service/entity/expenses/get-expense.service';

@Controller(DependencyEntityTokens.EXPENSE)
export class ExpensesController extends AbstractController<
  Expense,
  ExpenseResponse,
  SearchExpenseDto,
  ExpenseBodyDto
> {
  constructor(
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    readonly getService: GetExpenseService,
    @Inject(`GENERIC_UPDATE_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    readonly updateService: GenericUpdateService<
      Expense,
      ExpenseResponse,
      ExpenseBodyDto,
      SearchExpenseDto
    >,
    @Inject(`GENERIC_CREATE_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    readonly createService: GenericCreateService<
      Expense,
      ExpenseResponse,
      ExpenseBodyDto
    >,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(
      DependencyEntityTokens.EXPENSE,
      getService,
      updateService,
      createService,
      fieldSchemaData,
      entitySchemaData,
      errorService,
      translationService
    );
  }

  @Get(`/groupby/pets/category`)
  async groupByPetsAndCategory(
    @Query() params: SearchExpenseDto
  ): Promise<GroupExpensesByPetAndCategoryResponse[]> {
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'search',
      params
    );
    return this.getService.groupByPetsAndCategory(params);
  }

  @Get(`/groupby/category/pets`)
  async groupByCategoryAndPet(
    @Query() params: SearchExpenseDto
  ): Promise<GroupExpensesByPetAndCategoryResponse[]> {
    await this.schemaValidator.validateRequestSchema(
      this.requestSchema,
      'search',
      params
    );
    return this.getService.groupByCategoryAndPet(params);
  }
}
