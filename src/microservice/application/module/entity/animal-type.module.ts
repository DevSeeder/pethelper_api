import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalTypesRepository } from 'src/microservice/adapter/repository/animal-types.repository';
import {
  AnimalType,
  AnimalTypesSchema
} from 'src/microservice/domain/schemas/animal-type.schema';
import { GetAnimalTypeService } from '../../service/entity/animal-types/get-animal-type.service';
import { importAsyncService } from '../../helper/init-service-module.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnimalType.name, schema: AnimalTypesSchema }
    ])
  ],
  controllers: [],
  providers: [AnimalTypesRepository, importAsyncService(GetAnimalTypeService)],
  exports: [AnimalTypesRepository, GetAnimalTypeService]
})
export class AnimalTypesModule {}
