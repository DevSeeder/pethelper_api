import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Animal,
  AnimalDocument
} from 'src/microservice/domain/schemas/entity/animals.schema';
import { GenericRepository } from '../generic.repository';

@Injectable()
export class AnimalsRepository extends GenericRepository<Animal> {
  constructor(
    @InjectModel(Animal.name)
    model: Model<AnimalDocument>
  ) {
    super(model);
  }
}
