import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import {
  ConfigSearchEngine,
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../domain/schemas/expense-categories.schema';
import { SearchConfigDto } from '../../dto/search/search-config.dto';

@Injectable()
export class GetExpenseCategoriesService extends AbstractGetService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  SearchConfigDto
> {
  constructor(protected readonly repository: ExpenseCategoriesRepository) {
    super(repository, 'Expense Category', [], ConfigSearchEngine);
  }
}
