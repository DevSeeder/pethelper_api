import {
  AnimalGroup,
  AnimalGroupsSchema
} from '../../../domain/schemas/entity/animal-group.schema';
import {
  AnimalType,
  AnimalTypesSchema
} from '../../../domain/schemas/entity/animal-type.schema';
import {
  Animal,
  AnimalsSchema
} from '../../../domain/schemas/entity/animals.schema';
import {
  Color,
  ColorsSchema
} from '../../../domain/schemas/entity/colors.schema';
import {
  ExpenseCategoriesSchema,
  ExpenseCategory
} from '../../../domain/schemas/entity/expense-categories.schema';
import {
  Expense,
  ExpensesSchema
} from '../../../domain/schemas/entity/expenses.schema';
import { Pet, PetsSchema } from '../../../domain/schemas/entity/pets.schema';
import { Race, RacesSchema } from '../../../domain/schemas/entity/races.schema';
import { User, UsersSchema } from '../../../domain/schemas/entity/users.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ModuleRef } from '@nestjs/core';
import { Model } from 'mongoose';
import { DependencyEntityTokens } from '../../app.constants';

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

export class EntityModelTokenBuilder {
  static buildMongooseStaticModelForFeature() {
    const arrModel = [];
    Object.keys(ModelEntityTokens).forEach((key) => {
      arrModel.push({
        name: ModelEntityTokens[key].modelName,
        schema: ModelEntityTokens[key].schema
      });
    });
    return arrModel;
  }

  static buildMongooseModelTokens() {
    return Object.keys(ModelEntityTokens).map((key) =>
      getModelToken(ModelEntityTokens[key].modelName)
    );
  }

  static async buildMongooseModelInjector(
    moduleRef: ModuleRef
  ): Promise<{ [key: string]: Model<any> }> {
    const modelsMap = {};
    for await (const key of Object.keys(ModelEntityTokens)) {
      const modelName: string = ModelEntityTokens[key].modelName;
      const modelNameKey = ModelEntityTokens[key].collection;
      modelsMap[modelNameKey] = await moduleRef.get(getModelToken(modelName), {
        strict: false
      });
    }
    return modelsMap;
  }
}
