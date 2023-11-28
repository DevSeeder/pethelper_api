import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../domain/schemas/expense-categories.schema';
import { SearchConfigDto } from '../../dto/search/search-config.dto';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';

@Injectable()
export class GetExpenseCategoriesService extends AbstractGetService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  SearchConfigDto
> {
  constructor(
    protected readonly repository: ExpenseCategoriesRepository,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Expense Category', ['config'], getFieldSchemaService);
  }
}
