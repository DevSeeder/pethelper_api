import { Module } from '@nestjs/common';
import {
  ExpenseCategory,
  ExpenseCategoriesSchema
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { ExpenseCategoriesController } from 'src/microservice/adapter/controller/expense-categories.controller';
import { GenericModule } from '../generic.module';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { DependencyEntityTokens } from '../../app.constants';

@Module({
  imports: [
    GenericModule.forFeature<ExpenseCategory>(
      ExpenseCategory.name,
      ExpenseCategoriesSchema,
      DependencyEntityTokens.EXPENSE_CATEGORY
    ),
    FieldSchemasModule,
    EntitySchemasModule,
    ErrorSchemasModule,
    TranslationsModule
  ],
  controllers: [ExpenseCategoriesController],
  providers: [],
  exports: []
})
export class ExpenseCategoriesModule {}
