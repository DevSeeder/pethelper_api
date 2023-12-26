import { Controller, Inject } from '@nestjs/common';
import { AbstractController } from './abstract.controller';
import {
  ExpenseCategory,
  ExpenseCategoryDocument
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { DomainBodyDto } from 'src/microservice/application/dto/body/domain-body.dto';
import { SearchDomainDto } from 'src/microservice/application/dto/search/search-domain.dto';
import { CreateExpenseCategoryService } from 'src/microservice/application/service/entity/expense-categories/create-expense-category.service';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { GenericGetService } from 'src/microservice/application/service/abstract/generic-get.service';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';

@Controller('expensecategories')
export class ExpenseCategoriesController extends AbstractController<
  ExpenseCategory,
  ExpenseCategoryDocument,
  ExpenseCategory,
  SearchDomainDto,
  DomainBodyDto
> {
  constructor(
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.EXPENSE_CATEGORY}`)
    protected readonly getService: GenericGetService<
      ExpenseCategory,
      ExpenseCategory,
      SearchDomainDto
    >,
    @Inject(`GENERIC_UPDATE_SERVICE_${DependencyEntityTokens.EXPENSE_CATEGORY}`)
    protected readonly updateService: GenericUpdateService<
      ExpenseCategory,
      ExpenseCategory,
      SearchDomainDto,
      DomainBodyDto
    >,
    protected readonly createService: CreateExpenseCategoryService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[],
    protected readonly errorService?: ErrorService,
    protected readonly translationService?: GetTranslationService
  ) {
    super(
      'expenseCategories',
      getService,
      updateService,
      createService,
      fieldSchemaData,
      entitySchemaData,
      errorService,
      translationService
    );
  }
}
