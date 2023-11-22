import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RacesRepository } from 'src/microservice/adapter/repository/races.repository';
import {
  Race,
  RacesSchema
} from 'src/microservice/domain/schemas/races.schema';
import { GetRaceService } from 'src/microservice/application/service/races/get-race.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Race.name, schema: RacesSchema }])
  ],
  controllers: [],
  providers: [RacesRepository, GetRaceService],
  exports: [RacesRepository, GetRaceService]
})
export class RacesModule {}
