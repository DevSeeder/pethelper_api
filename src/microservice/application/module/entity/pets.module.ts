import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsController } from 'src/microservice/adapter/controller/pets.controller';
import { PetsRepository } from 'src/microservice/adapter/repository/pets.repository';
import { Pet, PetsSchema } from 'src/microservice/domain/schemas/pets.schema';
import { GetPetService } from 'src/microservice/application/service/entity/pets/get-pet.service';
import { ColorsModule } from './colors.module';
import { AnimalsModule } from './animals.module';
import { RacesModule } from './races.module';
import { UpdatePetService } from '../../service/entity/pets/update-pet.service';
import { CreatePetService } from '../../service/entity/pets/create-pet.service';
import { UsersModule } from './users.module';
import { ExpensesModule } from './expenses.module';
import { ExpensesController } from 'src/microservice/adapter/controller/expenses.controller';
import { GetExpenseService } from '../../service/entity/expenses/get-Expense.service';
import { ExpenseCategoriesModule } from './expense-categories.module';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { importAsyncService } from '../../helper/init-service-module.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetsSchema }]),
    ColorsModule,
    AnimalsModule,
    RacesModule,
    UsersModule,
    forwardRef(() => ExpensesModule),
    ExpenseCategoriesModule,
    FieldSchemasModule
  ],
  controllers: [PetsController, ExpensesController],
  providers: [
    PetsRepository,
    importAsyncService(GetPetService),
    importAsyncService(UpdatePetService),
    importAsyncService(CreatePetService),
    importAsyncService(GetExpenseService)
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
