import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalsSchema
} from 'src/microservice/domain/schemas/animals.schema';
import { GetAnimalService } from 'src/microservice/application/service/animals/get-animal.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalsSchema }])
  ],
  controllers: [],
  providers: [AnimalsRepository, GetAnimalService],
  exports: [AnimalsRepository, GetAnimalService]
})
export class AnimalsModule {}
