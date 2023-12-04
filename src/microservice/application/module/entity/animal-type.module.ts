import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalTypesRepository } from 'src/microservice/adapter/repository/animal-types.repository';
import {
  AnimalType,
  AnimalTypesSchema
} from 'src/microservice/domain/schemas/animal-type.schema';
import { GetAnimalTypeService } from '../../service/entity/animal-types/get-animal-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnimalType.name, schema: AnimalTypesSchema }
    ])
  ],
  controllers: [],
  providers: [AnimalTypesRepository, GetAnimalTypeService],
  exports: [AnimalTypesRepository, GetAnimalTypeService]
})
export class AnimalTypesModule {}
