import { Inject, Injectable } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from '../../../../domain/schemas/entity/expense-categories.schema';
import { ExpenseCategoriesRepository } from 'src/microservice/adapter/repository/entity/expense-categories.repository';
import { DomainBodyDto } from '../../../dto/body/domain-body.dto';
import { AbstractCreateService } from '../../abstract/abstract-create.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';

@Injectable()
export class CreateExpenseCategoryService extends AbstractCreateService<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  DomainBodyDto
> {
  constructor(
    protected readonly repository: ExpenseCategoriesRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(
      repository,
      'expenseCategories',
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
