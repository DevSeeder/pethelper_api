import { Controller, Get, Inject, Query } from '@nestjs/common';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-Expense.dto';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import { Expense } from 'src/microservice/domain/schemas/entity/expenses.schema';
import { ExpenseBodyDto } from 'src/microservice/application/dto/body/expense-body.dto';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';
import {
  ErrorService,
  GetTranslationService,
  SchemaDependecyTokens
} from '@devseeder/nestjs-microservices-schemas';
import { GroupExpensesByPetAndCategoryResponse } from 'src/microservice/application/dto/response/groupby/group-expenses-by-pet-and-category.response';
import { GetExpenseService } from 'src/microservice/application/service/entity/expenses/get-expense.service';
import {
  EntitySchema,
  FieldSchema
} from '@devseeder/nestjs-microservices-schemas';
import { AbstractController } from '../abstract/abstract.controller';

@Controller(DependencyEntityTokens.EXPENSE)
export class ExpensesGetController extends AbstractController<
  Expense,
  ExpenseResponse,
  SearchExpenseDto,
  ExpenseBodyDto
> {
  constructor(
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    readonly getService: GetExpenseService,
    @Inject(SchemaDependecyTokens.FIELD_SCHEMA_DB)
    readonly fieldSchemaData?: FieldSchema[],
    @Inject(SchemaDependecyTokens.ENTITY_SCHEMA_DB)
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(
      DependencyEntityTokens.EXPENSE,
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
