import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Pet,
  PetDocument
} from 'src/microservice/domain/schemas/entity/pets.schema';
import { GenericRepository } from '../generic.repository';

@Injectable()
export class PetsRepository extends GenericRepository<Pet> {
  constructor(
    @InjectModel(Pet.name)
    model: Model<PetDocument>
  ) {
    super(model);
  }
}
