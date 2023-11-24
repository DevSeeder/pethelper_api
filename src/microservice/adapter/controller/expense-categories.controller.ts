import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query
} from '@nestjs/common';
import { AbstractController } from './abstract.controller';
import { ConfigInputSchema } from '../schemas/config-input.schema';
import { GetExpenseCategoriesService } from 'src/microservice/application/service/expense-categories/get-expense-category.service';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/expense-categories.schema';
import { ConfigBodyDto } from 'src/microservice/application/dto/body/config-body.dto';
import { SearchConfigDto } from 'src/microservice/application/dto/search/search-config.dto';
import { UpdateExpenseCategoryService } from 'src/microservice/application/service/expense-categories/update-expense-category.service';
import { CreateExpenseCategoryService } from 'src/microservice/application/service/expense-categories/create-expense-category.service';

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
    protected readonly createService: CreateExpenseCategoryService
  ) {
    super(
      getService,
      '',
      null,
      ConfigInputSchema,
      'Expense Category',
      ['searchBy'],
      updateService,
      createService
    );
  }
}
