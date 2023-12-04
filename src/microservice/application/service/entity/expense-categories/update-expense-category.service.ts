import { Inject, Injectable } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../../domain/schemas/entity/expense-categories.schema';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/expense-categories.repository';
import { ConfigBodyDto } from '../../../dto/body/config-body.dto';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { SearchConfigDto } from '../../../dto/search/search-config.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

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
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(repository, 'Expense Category', ['config'], fieldSchemaData);
  }
}
