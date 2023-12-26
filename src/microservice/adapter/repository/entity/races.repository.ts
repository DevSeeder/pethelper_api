import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Race,
  RaceDocument
} from 'src/microservice/domain/schemas/entity/races.schema';
import { GenericRepository } from '../generic.repository';

@Injectable()
export class RacesRepository extends GenericRepository<Race> {
  constructor(
    @InjectModel(Race.name)
    model: Model<RaceDocument>
  ) {
    super(model);
  }
}
