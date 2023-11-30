import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalGroupsRepository } from 'src/microservice/adapter/repository/animal-groups.repository';
import {
  AnimalGroup,
  AnimalGroupsSchema
} from 'src/microservice/domain/schemas/animal-group.schema';
import { GetAnimalGroupService } from 'src/microservice/application/service/entity/animal-groups/get-animal-group.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { importAsyncService } from '../../helper/init-service-module.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnimalGroup.name, schema: AnimalGroupsSchema }
    ]),
    FieldSchemasModule
  ],
  controllers: [],
  providers: [
    AnimalGroupsRepository,
    importAsyncService(GetAnimalGroupService)
  ],
  exports: [AnimalGroupsRepository, GetAnimalGroupService]
})
export class AnimalGroupsModule {}
