import { Color, ColorsSchema } from '../schemas/colors.schema';
import { AnimalType, AnimalTypesSchema } from '../schemas/animal-type.schema';
import {
  AnimalGroup,
  AnimalGroupsSchema
} from '../schemas/animal-group.schema';
import { Race, RacesSchema } from '../schemas/races.schema';
import {
  ExpenseCategory,
  ExpenseCategoriesSchema
} from '../schemas/expense-categories.schema';
import { Animal, AnimalsSchema } from '../schemas/animals.schema';
import { Pet, PetsSchema } from '../schemas/pets.schema';
import { Expense, ExpensesSchema } from '../schemas/expenses.schema';
import { User, UsersSchema } from '../schemas/users.schema';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';
import { ExpensesGetController } from 'src/microservice/adapter/controller/entity/expenses-get.controller';
import { GetExpenseService } from 'src/microservice/application/service/expenses/get-expense.service';
import { ExpensesRepository } from 'src/microservice/adapter/repository/expenses.repository';
import { ModelEntityTokens } from '@devseeder/nestjs-microservices-commons';
import { ClientAuthService } from '@devseeder/nestjs-microservices-core';
import { CreateUserService } from 'src/microservice/application/service/users/create-user.service';

export const EntitySetupConfig: ModelEntityTokens = {
  colors: {
    modelName: Color.name,
    schema: ColorsSchema,
    collection: DependencyEntityTokens.COLOR
  },
  animalTypes: {
    modelName: AnimalType.name,
    schema: AnimalTypesSchema,
    collection: DependencyEntityTokens.ANIMAL_TYPE
  },
  animalGroups: {
    modelName: AnimalGroup.name,
    schema: AnimalGroupsSchema,
    collection: DependencyEntityTokens.ANIMAL_GROUP
  },
  races: {
    modelName: Race.name,
    schema: RacesSchema,
    collection: DependencyEntityTokens.RACE
  },
  expenseCategories: {
    modelName: ExpenseCategory.name,
    schema: ExpenseCategoriesSchema,
    collection: DependencyEntityTokens.EXPENSE_CATEGORY
  },
  animals: {
    modelName: Animal.name,
    schema: AnimalsSchema,
    collection: DependencyEntityTokens.ANIMAL
  },
  pets: {
    modelName: Pet.name,
    schema: PetsSchema,
    collection: DependencyEntityTokens.PET
  },
  expenses: {
    modelName: Expense.name,
    schema: ExpensesSchema,
    collection: DependencyEntityTokens.EXPENSE,
    customProvider: {
      controller: {
        get: ExpensesGetController
      },
      get: { className: GetExpenseService },
      repository: ExpensesRepository
    }
  },
  users: {
    modelName: User.name,
    schema: UsersSchema,
    collection: DependencyEntityTokens.USER,
    customProvider: {
      create: {
        className: CreateUserService,
        injectArgs: [ClientAuthService.name]
      }
    }
  }
};
