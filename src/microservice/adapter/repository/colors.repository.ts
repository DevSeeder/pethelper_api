import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  Color,
  ColorDocument
} from 'src/microservice/domain/schemas/colors.schema';

@Injectable()
export class ColorsRepository extends MongooseRepository<Color, ColorDocument> {
  constructor(
    @InjectModel(Color.name)
    model: Model<ColorDocument>
  ) {
    super(model);
  }
}
