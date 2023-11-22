import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  Race,
  RaceDocument
} from 'src/microservice/domain/schemas/races.schema';

@Injectable()
export class RacesRepository extends MongooseRepository<Race, RaceDocument> {
  constructor(
    @InjectModel(Race.name)
    model: Model<RaceDocument>
  ) {
    super(model);
  }
}
