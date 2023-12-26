import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import {
  Pet,
  PetsSchema
} from 'src/microservice/domain/schemas/entity/pets.schema';
import { GetPetService } from 'src/microservice/application/service/entity/pets/get-pet.service';
import { AnimalsModule } from './animals.module';
import { UpdatePetService } from '../../service/entity/pets/update-pet.service';
import { CreatePetService } from '../../service/entity/pets/create-pet.service';
import { UsersModule } from './users.module';
import { ExpensesModule } from './expenses.module';
import { ExpensesController } from 'src/microservice/adapter/controller/expenses.controller';
import { GetExpenseService } from '../../service/entity/expenses/get-Expense.service';
import { ExpenseCategoriesModule } from './expense-categories.module';
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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetsSchema }]),
    GenericModule.forFeature<Color>(Color.name, ColorsSchema, 'colors'),
    AnimalsModule,
    GenericModule.forFeature<Race>(Race.name, RacesSchema, 'races'),
    UsersModule,
    forwardRef(() => ExpensesModule),
    ExpenseCategoriesModule,
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule,
    ErrorSchemasModule
  ],
  controllers: [PetsController, ExpensesController],
  providers: [
    PetsRepository,
    GetPetService,
    UpdatePetService,
    CreatePetService,
    GetExpenseService
  ],
  exports: [
    PetsRepository,
    GetPetService,
    UpdatePetService,
    CreatePetService,
    GetExpenseService
  ]
})
export class PetsModule {}
