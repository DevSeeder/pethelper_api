import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../domain/schemas/expense-categories.schema';
import { Search } from '../../dto/search/search.dto';

@Injectable()
export class GetExpenseCategoriesService extends AbstractGetService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  Search
> {
  constructor(protected readonly repository: ExpenseCategoriesRepository) {
    super(repository, 'Expense Category');
  }
}
