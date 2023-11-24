import { Injectable } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../domain/schemas/expense-categories.schema';
import { AbstractUpdateService } from '../abstract/abstract-update.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import { ConfigBodyDto } from '../../dto/body/config-body.dto';

@Injectable()
export class UpdateExpenseCategoryService extends AbstractUpdateService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  ConfigBodyDto
> {
  constructor(protected readonly repository: ExpenseCategoriesRepository) {
    super(repository, 'Expense Category');
  }
}
