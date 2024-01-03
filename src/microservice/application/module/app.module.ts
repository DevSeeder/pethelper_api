import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../../config/configuration';
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
import { CreateUserService } from '../service/entity/users/create-user.service';
import { ClientAuthService } from 'src/microservice/adapter/repository/client/client-auth.service';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { CustomInterceptor } from 'src/core/custom.interceptor';

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
    GenericModule.forFeature(Pet.name, DependencyEntityTokens.PET),
    GenericModule.forFeature(Expense.name, DependencyEntityTokens.EXPENSE, {
      controller: {
        get: ExpensesGetController
      },
      get: { className: GetExpenseService },
      repository: ExpensesRepository
    }),
    GenericModule.forFeature(
      ExpenseCategory.name,
      DependencyEntityTokens.EXPENSE_CATEGORY
    ),
    GenericModule.forFeature(Animal.name, DependencyEntityTokens.ANIMAL),
    GenericModule.forFeature(User.name, DependencyEntityTokens.USER, {
      create: {
        className: CreateUserService,
        injectArgs: [ClientAuthService.name]
      }
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomInterceptor
    }
  ],
  exports: []
})
export class AppModule {}
