import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  AnimalType,
  AnimalTypeDocument
} from 'src/microservice/domain/schemas/animal-type.schema';

@Injectable()
export class AnimalTypesRepository extends MongooseRepository<
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
