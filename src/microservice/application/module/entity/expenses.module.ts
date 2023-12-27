import { Module, forwardRef } from '@nestjs/common';
import { ExpensesController } from 'src/microservice/adapter/controller/expenses.controller';
import {
  Expense,
  ExpensesSchema
} from 'src/microservice/domain/schemas/entity/expenses.schema';
import { PetsModule } from './pets.module';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { GenericModule } from '../generic.module';
import {
  ExpenseCategoriesSchema,
  ExpenseCategory
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { DependencyEntityTokens } from '../../app.constants';
import {
  User,
  UsersSchema
} from 'src/microservice/domain/schemas/entity/users.schema';
import { GetExpenseService } from '../../service/entity/expenses/get-expense.service';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';

@Module({
  imports: [
    GenericModule.forFeature<Expense>(
      Expense.name,
      ExpensesSchema,
      DependencyEntityTokens.EXPENSE,
      { get: GetExpenseService, repository: ExpensesRepository }
    ),
    forwardRef(() => PetsModule),
    GenericModule.forFeature<User>(
      User.name,
      UsersSchema,
      DependencyEntityTokens.USER
    ),
    GenericModule.forFeature<ExpenseCategory>(
      ExpenseCategory.name,
      ExpenseCategoriesSchema,
      DependencyEntityTokens.EXPENSE_CATEGORY
    ),
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule,
    ErrorSchemasModule
  ],
  controllers: [ExpensesController],
  providers: [],
  exports: []
})
export class ExpensesModule {}
