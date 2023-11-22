import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Pet, PetDocument } from 'src/microservice/domain/schemas/pets.schema';

@Injectable()
export class PetsRepository extends MongooseRepository<Pet, PetDocument> {
  constructor(
    @InjectModel(Pet.name)
    model: Model<PetDocument>
  ) {
    super(model);
  }
}
