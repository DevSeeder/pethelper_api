import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AnimalType,
  AnimalTypeDocument
} from 'src/microservice/domain/schemas/entity/animal-type.schema';
import { AbstractRepository } from '../abstract.repository';

@Injectable()
export class AnimalTypesRepository extends AbstractRepository<
  AnimalType,
  AnimalTypeDocument
> {
  constructor(
    @InjectModel(AnimalType.name)
    model: Model<AnimalTypeDocument>
  ) {
    super(model);
  }
}
