import { Controller, Inject, Query } from '@nestjs/common';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-Expense.dto';
import { AbstractController } from './abstract.controller';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import {
  Expense,
  ExpenseDocument
} from 'src/microservice/domain/schemas/entity/expenses.schema';
import { UpdateExpenseService } from 'src/microservice/application/service/entity/expenses/update-expense.service';
import { ExpenseBodyDto } from 'src/microservice/application/dto/body/expense-body.dto';
import { CreateExpenseService } from 'src/microservice/application/service/entity/expenses/create-expense.service';
import { GetExpenseService } from 'src/microservice/application/service/entity/expenses/get-Expense.service';
import { Get } from '@nestjs/common';
import { GroupExpensesByPetAndCategoryResponse } from 'src/microservice/application/dto/response/groupby/group-expenses-by-pet-and-category.response';
import { SchemaValidator } from 'src/microservice/application/helper/schema-validator.helper';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

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
    protected readonly createService: CreateExpenseService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(
      'expenses',
      getService,
      updateService,
      createService,
      fieldSchemaData,
      entitySchemaData
    );
  }

  @Get(`/groupby/pets/category`)
  groupByPetsAndCategory(
    @Query() params: SearchExpenseDto
  ): Promise<GroupExpensesByPetAndCategoryResponse[]> {
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    return this.getService.groupByPetsAndCategory(params);
  }

  @Get(`/groupby/category/pets`)
  groupByCategoryAndPet(
    @Query() params: SearchExpenseDto
  ): Promise<GroupExpensesByPetAndCategoryResponse[]> {
    SchemaValidator.validateSchema(this.inputSchema.search, params);
    return this.getService.groupByCategoryAndPet(params);
  }
}
