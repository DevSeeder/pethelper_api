import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Race,
  RaceDocument
} from 'src/microservice/domain/schemas/races.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class RacesRepository extends AbstractRepository<Race, RaceDocument> {
  constructor(
    @InjectModel(Race.name)
    model: Model<RaceDocument>
  ) {
    super(model);
  }
}
