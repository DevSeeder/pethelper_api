import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from 'src/microservice/domain/schemas/pets.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class PetsRepository extends AbstractRepository<Pet, PetDocument> {
  constructor(
    @InjectModel(Pet.name)
    model: Model<PetDocument>
  ) {
    super(model);
  }
}
