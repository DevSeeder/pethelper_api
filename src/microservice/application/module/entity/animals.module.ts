import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsRepository } from 'src/microservice/adapter/repository/entity/animals.repository';
import {
  Animal,
  AnimalsSchema
} from 'src/microservice/domain/schemas/entity/animals.schema';
import { GetAnimalService } from 'src/microservice/application/service/entity/animals/get-animal.service';
import { AnimalsController } from 'src/microservice/adapter/controller/animals.controller';
import { AnimalGroupsModule } from './animal-group.module';
import { UpdateAnimalService } from '../../service/entity/animals/update-animal.service';
import { CreateAnimalService } from '../../service/entity/animals/create-animal.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalsSchema }]),
    AnimalGroupsModule,
    FieldSchemasModule,
    EntitySchemasModule
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
