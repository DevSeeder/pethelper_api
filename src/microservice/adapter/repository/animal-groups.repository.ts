import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  AnimalGroup,
  AnimalGroupDocument
} from 'src/microservice/domain/schemas/animal-group.schema';

@Injectable()
export class AnimalGroupsRepository extends MongooseRepository<
  AnimalGroup,
  AnimalGroupDocument
> {
  constructor(
    @InjectModel(AnimalGroup.name)
    model: Model<AnimalGroupDocument>
  ) {
    super(model);
  }
}
