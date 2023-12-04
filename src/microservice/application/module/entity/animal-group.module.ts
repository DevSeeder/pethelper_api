import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalGroupsRepository } from 'src/microservice/adapter/repository/entity/animal-groups.repository';
import {
  AnimalGroup,
  AnimalGroupsSchema
} from 'src/microservice/domain/schemas/entity/animal-group.schema';
import { GetAnimalGroupService } from 'src/microservice/application/service/entity/animal-groups/get-animal-group.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnimalGroup.name, schema: AnimalGroupsSchema }
    ]),
    FieldSchemasModule
  ],
  controllers: [],
  providers: [AnimalGroupsRepository, GetAnimalGroupService],
  exports: [AnimalGroupsRepository, GetAnimalGroupService]
})
export class AnimalGroupsModule {}
