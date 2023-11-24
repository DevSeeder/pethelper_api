import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalGroupsRepository } from 'src/microservice/adapter/repository/animal-groups.repository';
import {
  AnimalGroup,
  AnimalGroupsSchema
} from 'src/microservice/domain/schemas/animal-group.schema';
import { GetAnimalGroupService } from 'src/microservice/application/service/animal-groups/get-animal-group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnimalGroup.name, schema: AnimalGroupsSchema }
    ])
  ],
  controllers: [],
  providers: [AnimalGroupsRepository, GetAnimalGroupService],
  exports: [AnimalGroupsRepository, GetAnimalGroupService]
})
export class AnimalGroupsModule {}
