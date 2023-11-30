import { Controller } from '@nestjs/common';
import { AbstractController } from './abstract.controller';
import { GetExpenseCategoriesService } from 'src/microservice/application/service/entity/expense-categories/get-expense-category.service';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/expense-categories.schema';
import { ConfigBodyDto } from 'src/microservice/application/dto/body/config-body.dto';
import { SearchConfigDto } from 'src/microservice/application/dto/search/search-config.dto';
import { UpdateExpenseCategoryService } from 'src/microservice/application/service/entity/expense-categories/update-expense-category.service';
import { CreateExpenseCategoryService } from 'src/microservice/application/service/entity/expense-categories/create-expense-category.service';
import { GetFieldSchemaService } from 'src/microservice/application/service/configuration/field-schemas/get-field-schemas.service';

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
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(
      'Expense Category',
      ['config'],
      '',
      ['searchBy'],
      getService,
      updateService,
      createService,
      getFieldSchemaService
    );
  }
}
