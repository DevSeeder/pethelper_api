import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesController } from 'src/microservice/adapter/controller/expenses.controller';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';
import {
  Expense,
  ExpensesSchema
} from 'src/microservice/domain/schemas/entity/expenses.schema';
import { GetExpenseService } from '../../service/entity/expenses/get-expense.service';
import { PetsModule } from './pets.module';
import { UpdateExpenseService } from '../../service/entity/expenses/update-expense.service';
import { CreateExpenseService } from '../../service/entity/expenses/create-expense.service';
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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpensesSchema }]),
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
  providers: [
    ExpensesRepository,
    GetExpenseService,
    UpdateExpenseService,
    CreateExpenseService
  ],
  exports: [
    ExpensesRepository,
    GetExpenseService,
    UpdateExpenseService,
    CreateExpenseService
  ]
})
export class ExpensesModule {}
