import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AnimalType,
  AnimalTypeDocument
} from 'src/microservice/domain/schemas/entity/animal-type.schema';
import { GenericRepository } from '../generic.repository';

@Injectable()
export class AnimalTypesRepository extends GenericRepository<AnimalType> {
  constructor(
    @InjectModel(AnimalType.name)
    model: Model<AnimalTypeDocument>
  ) {
    super(model);
  }
}
