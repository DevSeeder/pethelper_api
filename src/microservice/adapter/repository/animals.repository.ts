import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  Color,
  ColorDocument
} from 'src/microservice/domain/schemas/colors.schema';
import {
  Animal,
  AnimalDocument
} from 'src/microservice/domain/schemas/animals.schema';

@Injectable()
export class AnimalsRepository extends MongooseRepository<
  Animal,
  AnimalDocument
> {
  constructor(
    @InjectModel(Animal.name)
    model: Model<AnimalDocument>
  ) {
    super(model);
  }
}
