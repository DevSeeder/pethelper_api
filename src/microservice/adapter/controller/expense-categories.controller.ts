import { Controller, Inject } from '@nestjs/common';
import { AbstractController } from './abstract.controller';
import { GetExpenseCategoriesService } from 'src/microservice/application/service/entity/expense-categories/get-expense-category.service';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { ConfigBodyDto } from 'src/microservice/application/dto/body/config-body.dto';
import { SearchConfigDto } from 'src/microservice/application/dto/search/search-config.dto';
import { UpdateExpenseCategoryService } from 'src/microservice/application/service/entity/expense-categories/update-expense-category.service';
import { CreateExpenseCategoryService } from 'src/microservice/application/service/entity/expense-categories/create-expense-category.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';

@Controller('expensecategories')
export class ExpenseCategoriesController extends AbstractController<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  SearchConfigDto,
  ConfigBodyDto
> {
  constructor(
    protected readonly getService: GetExpenseCategoriesService,
    protected readonly updateService: UpdateExpenseCategoryService,
    protected readonly createService: CreateExpenseCategoryService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      'Expense Category',
      ['config'],
      '',
      ['searchBy'],
      getService,
      updateService,
      createService,
      fieldSchemaData
    );
  }
}
