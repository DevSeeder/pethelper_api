import { Injectable } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../domain/schemas/expense-categories.schema';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import { ConfigBodyDto } from '../../dto/body/config-body.dto';
import { AbstractCreateService } from '../abstract/abstract-create.service';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';

@Injectable()
export class CreateExpenseCategoryService extends AbstractCreateService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  ConfigBodyDto
> {
  constructor(
    protected readonly repository: ExpenseCategoriesRepository,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(
      repository,
      'Expense Category',
      ['expenseCategories', 'config'],
      getFieldSchemaService
    );
  }
}
