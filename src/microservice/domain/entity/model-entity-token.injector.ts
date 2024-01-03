import { Color, ColorsSchema } from '../schemas/entity/colors.schema';
import {
  AnimalType,
  AnimalTypesSchema
} from '../schemas/entity/animal-type.schema';
import {
  AnimalGroup,
  AnimalGroupsSchema
} from '../schemas/entity/animal-group.schema';
import { Race, RacesSchema } from '../schemas/entity/races.schema';
import {
  ExpenseCategory,
  ExpenseCategoriesSchema
} from '../schemas/entity/expense-categories.schema';
import { Animal, AnimalsSchema } from '../schemas/entity/animals.schema';
import { Pet, PetsSchema } from '../schemas/entity/pets.schema';
import { Expense, ExpensesSchema } from '../schemas/entity/expenses.schema';
import { User, UsersSchema } from '../schemas/entity/users.schema';
import { DependencyEntityTokens } from 'src/microservice/application/app.constants';

export const ModelEntityTokens = {
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
    collection: DependencyEntityTokens.EXPENSE
  },
  users: {
    modelName: User.name,
    schema: UsersSchema,
    collection: DependencyEntityTokens.USER
  }
};
