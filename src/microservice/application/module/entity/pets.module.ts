import { Module } from '@nestjs/common';
import { GetExpenseService } from '../../service/entity/expenses/get-expense.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { PetsController } from '../../../adapter/controller/pets.controller';
import { GenericModule } from '../generic.module';
import { Color } from 'src/microservice/domain/schemas/entity/colors.schema';
import { Race } from 'src/microservice/domain/schemas/entity/races.schema';
import { DependencyEntityTokens } from '../../app.constants';
import { ExpenseCategory } from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import { User } from 'src/microservice/domain/schemas/entity/users.schema';
import { Animal } from 'src/microservice/domain/schemas/entity/animals.schema';
import { Expense } from 'src/microservice/domain/schemas/entity/expenses.schema';
import { ExpensesRepository } from 'src/microservice/adapter/repository/entity/expenses.repository';
import { Pet } from 'src/microservice/domain/schemas/entity/pets.schema';

@Module({
  imports: [
    GenericModule.forFeature<Color>(Pet.name, DependencyEntityTokens.PET),
    GenericModule.forFeature<Color>(Color.name, DependencyEntityTokens.COLOR),
    GenericModule.forFeature<Animal>(
      Animal.name,
      DependencyEntityTokens.ANIMAL
    ),
    GenericModule.forFeature<Race>(Race.name, DependencyEntityTokens.RACE),
    GenericModule.forFeature<User>(User.name, DependencyEntityTokens.USER),
    GenericModule.forFeature<Expense>(
      Expense.name,
      DependencyEntityTokens.EXPENSE,
      { get: GetExpenseService, repository: ExpensesRepository }
    ),
    GenericModule.forFeature<ExpenseCategory>(
      ExpenseCategory.name,
      DependencyEntityTokens.EXPENSE_CATEGORY
    ),
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule,
    ErrorSchemasModule
  ],
  controllers: [PetsController],
  providers: [],
  exports: []
})
export class PetsModule {}
