import { Injectable } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../domain/schemas/expense-categories.schema';
import { AbstractUpdateService } from '../abstract/abstract-update.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import { ConfigBodyDto } from '../../dto/body/config-body.dto';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';
import { SearchConfigDto } from '../../dto/search/search-config.dto';

@Injectable()
export class UpdateExpenseCategoryService extends AbstractUpdateService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  ConfigBodyDto,
  SearchConfigDto
> {
  constructor(
    protected readonly repository: ExpenseCategoriesRepository,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Expense Category', ['config'], getFieldSchemaService);
  }
}
