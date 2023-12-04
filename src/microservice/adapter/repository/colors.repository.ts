import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Color,
  ColorDocument
} from 'src/microservice/domain/schemas/entity/colors.schema';
import { AbstractRepository } from './abstract.repository';

@Injectable()
export class ColorsRepository extends AbstractRepository<Color, ColorDocument> {
  constructor(
    @InjectModel(Color.name)
    model: Model<ColorDocument>
  ) {
    super(model);
  }
}
