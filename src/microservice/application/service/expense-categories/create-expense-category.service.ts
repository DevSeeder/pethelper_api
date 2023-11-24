import { Injectable } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../domain/schemas/expense-categories.schema';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import { ConfigBodyDto } from '../../dto/body/config-body.dto';
import { AbstractCreateService } from '../abstract/abstract-create.service';

@Injectable()
export class CreateExpenseCategoryService extends AbstractCreateService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  ConfigBodyDto
> {
  constructor(protected readonly repository: ExpenseCategoriesRepository) {
    super(repository, 'Expense Category');
  }
}
