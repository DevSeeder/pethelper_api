import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalsSchema
} from 'src/microservice/domain/schemas/animals.schema';
import { GetAnimalService } from 'src/microservice/application/service/entity/animals/get-animal.service';
import { AnimalsController } from 'src/microservice/adapter/controller/animals.controller';
import { AnimalGroupsModule } from './animal-group.module';
import { UpdateAnimalService } from '../../service/entity/animals/update-animal.service';
import { CreateAnimalService } from '../../service/entity/animals/create-animal.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { importAsyncService } from '../../helper/init-service-module.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalsSchema }]),
    AnimalGroupsModule,
    FieldSchemasModule
  ],
  controllers: [AnimalsController],
  providers: [
    AnimalsRepository,
    importAsyncService(GetAnimalService),
    importAsyncService(UpdateAnimalService),
    importAsyncService(CreateAnimalService)
  ],
  exports: [
    AnimalsRepository,
    GetAnimalService,
    UpdateAnimalService,
    CreateAnimalService
  ]
})
export class AnimalsModule {}
