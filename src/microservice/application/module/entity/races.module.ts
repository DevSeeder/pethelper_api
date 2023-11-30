import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RacesRepository } from 'src/microservice/adapter/repository/races.repository';
import {
  Race,
  RacesSchema
} from 'src/microservice/domain/schemas/races.schema';
import { GetRaceService } from 'src/microservice/application/service/entity/races/get-race.service';
import { FieldSchemasModule } from '../configuration/field-schemas.module';
import { importAsyncService } from '../../helper/init-service-module.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Race.name, schema: RacesSchema }]),
    FieldSchemasModule
  ],
  controllers: [],
  providers: [RacesRepository, importAsyncService(GetRaceService)],
  exports: [RacesRepository, GetRaceService]
})
export class RacesModule {}
