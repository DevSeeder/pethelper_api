import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsRepository } from 'src/microservice/adapter/repository/entity/animals.repository';
import {
  Animal,
  AnimalsSchema
} from 'src/microservice/domain/schemas/entity/animals.schema';
import { GetAnimalService } from 'src/microservice/application/service/entity/animals/get-animal.service';
import { AnimalsController } from 'src/microservice/adapter/controller/animals.controller';
import { UpdateAnimalService } from '../../service/entity/animals/update-animal.service';
import { CreateAnimalService } from '../../service/entity/animals/create-animal.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { EntitySchemasModule } from '../configuration/entity-schemas.module';
import { TranslationsModule } from '../translation/translation.module';
import { ErrorSchemasModule } from '../configuration/error-schemas.module';
import { GenericModule } from '../generic.module';
import {
  AnimalGroup,
  AnimalGroupsSchema
} from 'src/microservice/domain/schemas/entity/animal-group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalsSchema }]),
    GenericModule.forFeature<AnimalGroup>(
      AnimalGroup.name,
      AnimalGroupsSchema,
      'animalGroups'
    ),
    FieldSchemasModule,
    EntitySchemasModule,
    TranslationsModule,
    ErrorSchemasModule
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
