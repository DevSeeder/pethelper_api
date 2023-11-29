import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AnimalGroup,
  AnimalGroupDocument
} from 'src/microservice/domain/schemas/animal-group.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class AnimalGroupsRepository extends AbstractRepository<
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
