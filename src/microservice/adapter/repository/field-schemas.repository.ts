import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FieldSchema,
  FieldSchemaDocument
} from 'src/microservice/domain/schemas/field-schemas.schema';

@Injectable()
export class FieldSchemasRepository extends MongooseRepository<
  FieldSchema,
  FieldSchemaDocument
> {
  constructor(
    @InjectModel(FieldSchema.name)
    model: Model<FieldSchemaDocument>
  ) {
    super(model);
  }
}
