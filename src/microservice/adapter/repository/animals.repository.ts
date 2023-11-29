import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Animal,
  AnimalDocument
} from 'src/microservice/domain/schemas/animals.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class AnimalsRepository extends AbstractRepository<
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
