import { Inject, Injectable } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../../domain/schemas/entity/expense-categories.schema';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/entity/expense-categories.repository';
import { DomainBodyDto } from '../../../dto/body/domain-body.dto';
import { SearchDomainDto } from '../../../dto/search/search-domain.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class UpdateExpenseCategoryService extends AbstractUpdateService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  DomainBodyDto,
  SearchDomainDto
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
