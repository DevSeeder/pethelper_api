import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../../config/configuration';
import { FieldSchemasModule } from './configuration/field-schemas.module';
import { GenericModule } from './generic.module';
import { ExpenseCategory } from '../../domain/schemas/entity/expense-categories.schema';
import { DependencyEntityTokens } from '../app.constants';
import { Animal } from '../../domain/schemas/entity/animals.schema';
import { User } from '../../domain/schemas/entity/users.schema';
import { Pet } from '../../domain/schemas/entity/pets.schema';
import { Expense } from '../../domain/schemas/entity/expenses.schema';
import { ExpensesGetController } from '../../adapter/controller/entity/expenses-get.controller';
import { GetExpenseService } from '../service/entity/expenses/get-expense.service';
import { ExpensesRepository } from '../../adapter/repository/entity/expenses.repository';
import { AuthJwtModule } from './auth/auth-jwt.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.mongodb.connection')
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    // HttpModule,
    GenericModule.forFeature<Pet>(Pet.name, DependencyEntityTokens.PET),
    GenericModule.forFeature<Expense>(
      Expense.name,
      DependencyEntityTokens.EXPENSE,
      {
        controller: {
          get: ExpensesGetController
        },
        get: GetExpenseService,
        repository: ExpensesRepository
      }
    ),
    GenericModule.forFeature<ExpenseCategory>(
      ExpenseCategory.name,
      DependencyEntityTokens.EXPENSE_CATEGORY
    ),
    GenericModule.forFeature<Animal>(
      Animal.name,
      DependencyEntityTokens.ANIMAL
    ),
    GenericModule.forFeature<User>(User.name, DependencyEntityTokens.USER)
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
