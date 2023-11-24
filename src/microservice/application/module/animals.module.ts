import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalsSchema
} from 'src/microservice/domain/schemas/animals.schema';
import { GetAnimalService } from 'src/microservice/application/service/animals/get-animal.service';
import { AnimalsController } from 'src/microservice/adapter/controller/animals.controller';
import { AnimalGroupsModule } from './animal-group.module';
import { UpdateAnimalService } from '../service/animals/update-animal.service';
import { CreateAnimalService } from '../service/animals/create-animal.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalsSchema }]),
    AnimalGroupsModule
  ],
  controllers: [AnimalsController],
  providers: [
    AnimalsRepository,
    GetAnimalService,
    UpdateAnimalService,
    CreateAnimalService
  ],
  exports: [
    AnimalsRepository,
    GetAnimalService,
    UpdateAnimalService,
    CreateAnimalService
  ]
})
export class AnimalsModule {}
