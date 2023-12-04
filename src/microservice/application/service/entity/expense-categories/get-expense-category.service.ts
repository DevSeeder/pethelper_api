import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/entity/expense-categories.repository';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../../domain/schemas/entity/expense-categories.schema';
import { SearchConfigDto } from '../../../dto/search/search-config.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class GetExpenseCategoriesService extends AbstractGetService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategoryDocument,
  SearchConfigDto
> {
  constructor(
    protected readonly repository: ExpenseCategoriesRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, 'expenseCategories', fieldSchemaData, entitySchemaData);
  }
}
