import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import {
  Pet,
  PetsSchema
} from 'src/microservice/domain/schemas/entity/pets.schema';
import { GetPetService } from 'src/microservice/application/service/entity/pets/get-pet.service';
import { UpdatePetService } from '../../service/entity/pets/update-pet.service';
import { CreatePetService } from '../../service/entity/pets/create-pet.service';
import { ExpensesModule } from './expenses.module';
import { ExpensesController } from 'src/microservice/adapter/controller/expenses.controller';
import { GetExpenseService } from '../../service/entity/expenses/get-expense.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { PetsController } from '../../../adapter/controller/pets.controller';
import { GenericModule } from '../generic.module';
import {
  Color,
  ColorsSchema
} from 'src/microservice/domain/schemas/entity/colors.schema';
import {
  Race,
  RacesSchema
} from 'src/microservice/domain/schemas/entity/races.schema';
import { DependencyEntityTokens } from '../../app.constants';
import {
  ExpenseCategoriesSchema,
  ExpenseCategory
} from 'src/microservice/domain/schemas/entity/expense-categories.schema';
import {
  User,
  UsersSchema
} from 'src/microservice/domain/schemas/entity/users.schema';
import {
  Animal,
  AnimalsSchema
} from 'src/microservice/domain/schemas/entity/animals.schema';
import {
  Expense,
  ExpensesSchema
} from 'src/microservice/domain/schemas/entity/expenses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetsSchema }]),
    GenericModule.forFeature<Color>(
      Color.name,
      ColorsSchema,
      DependencyEntityTokens.COLOR
    ),
    GenericModule.forFeature<Animal>(
      Animal.name,
      AnimalsSchema,
      DependencyEntityTokens.ANIMAL
    ),
    GenericModule.forFeature<Race>(
      Race.name,
      RacesSchema,
      DependencyEntityTokens.RACE
    ),
    GenericModule.forFeature<User>(
      User.name,
      UsersSchema,
      DependencyEntityTokens.USER
    ),
    GenericModule.forFeature<Expense>(
      Expense.name,
      ExpensesSchema,
      DependencyEntityTokens.EXPENSE,
      { get: GetExpenseService }
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
  controllers: [PetsController],
  providers: [
    PetsRepository,
    GetPetService,
    UpdatePetService,
    CreatePetService
  ],
  exports: [PetsRepository, GetPetService, UpdatePetService, CreatePetService]
})
export class PetsModule {}
