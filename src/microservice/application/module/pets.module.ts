import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsController } from 'src/microservice/adapter/controller/pets.controller';
import { PetsRepository } from 'src/microservice/adapter/repository/pets.repository';
import { Pet, PetsSchema } from 'src/microservice/domain/schemas/pets.schema';
import { GetPetService } from 'src/microservice/application/service/pets/get-pet.service';
import { ColorsModule } from './colors.module';
import { AnimalsModule } from './animals.module';
import { RacesModule } from './races.module';
import { UpdatePetService } from '../service/pets/update-pet.service';
import { CreatePetService } from '../service/pets/create-pet.service';
import { UsersModule } from './users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetsSchema }]),
    ColorsModule,
    AnimalsModule,
    RacesModule,
    UsersModule
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
