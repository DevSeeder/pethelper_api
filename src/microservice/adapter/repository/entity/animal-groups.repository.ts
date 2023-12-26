import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AnimalGroup,
  AnimalGroupDocument
} from 'src/microservice/domain/schemas/entity/animal-group.schema';
import { GenericRepository } from '../generic.repository';

@Injectable()
export class AnimalGroupsRepository extends GenericRepository<AnimalGroup> {
  constructor(
    @InjectModel(AnimalGroup.name)
    model: Model<AnimalGroupDocument>
  ) {
    super(model);
  }
}
