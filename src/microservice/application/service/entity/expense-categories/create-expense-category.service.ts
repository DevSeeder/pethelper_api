import { Inject, Injectable } from '@nestjs/common';
import { ExpenseCategory } from '../../../../domain/schemas/entity/expense-categories.schema';
import { DomainBodyDto } from '../../../dto/body/domain-body.dto';
import { GenericCreateService } from '../../abstract/generic-create.service';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';

@Injectable()
export class CreateExpenseCategoryService extends GenericCreateService<
  ExpenseCategory,
  ExpenseCategory,
  DomainBodyDto
> {
  constructor(
    @Inject(`GENERIC_REPOSITORY_${DependencyEntityTokens.EXPENSE_CATEGORY}`)
    protected readonly repository: GenericRepository<ExpenseCategory>,
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
