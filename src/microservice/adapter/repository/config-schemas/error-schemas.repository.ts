import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ErrorSchema,
  ErrorSchemaDocument
} from 'src/microservice/domain/schemas/configuration-schemas/error-schemas.schema';

@Injectable()
export class ErrorSchemasRepository extends MongooseRepository<
  ErrorSchema,
  ErrorSchemaDocument
> {
  constructor(
    @InjectModel(ErrorSchema.name)
    model: Model<ErrorSchemaDocument>
  ) {
    super(model);
  }
}
