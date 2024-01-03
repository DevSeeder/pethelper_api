import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../../../config/configuration';
import { ExpenseCategory } from '../../domain/schemas/entity/expense-categories.schema';
import { DependencyEntityTokens, PROJECT_KEY } from '../app.constants';
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
import { GenericModule } from '@devseeder/nestjs-microservices-commons';
import { CustomJwtAuthGuard } from 'src/core/custom-jwt-auth.guard';
import { ModelEntityTokens } from 'src/microservice/domain/entity/model-entity-token.injector';
import { SCOPE_KEY } from 'src/microservice/domain/enum/enum-scopes.enum';

const moduleOptions = {
  authGuard: CustomJwtAuthGuard,
  interceptor: CustomInterceptor,
  configuration: configuration,
  modelTokens: ModelEntityTokens,
  projectKey: PROJECT_KEY,
  scopeKey: SCOPE_KEY
};

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
    GenericModule.forFeature({
      ...moduleOptions,
      modelName: Pet.name,
      entity: DependencyEntityTokens.PET
    }),
    GenericModule.forFeature({
      ...moduleOptions,
      modelName: Expense.name,
      entity: DependencyEntityTokens.EXPENSE,
      customProvider: {
        controller: {
          get: ExpensesGetController
        },
        get: { className: GetExpenseService },
        repository: ExpensesRepository
      }
    }),
    GenericModule.forFeature({
      ...moduleOptions,
      modelName: ExpenseCategory.name,
      entity: DependencyEntityTokens.EXPENSE_CATEGORY
    }),
    GenericModule.forFeature({
      ...moduleOptions,
      modelName: Animal.name,
      entity: DependencyEntityTokens.ANIMAL
    }),
    GenericModule.forFeature({
      ...moduleOptions,
      modelName: User.name,
      entity: DependencyEntityTokens.USER,
      customProvider: {
        create: {
          className: CreateUserService,
          injectArgs: [ClientAuthService.name]
        }
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
