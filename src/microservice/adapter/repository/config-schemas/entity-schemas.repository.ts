import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EntitySchema,
  EntitySchemaDocument
} from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class EntitySchemasRepository extends MongooseRepository<
  EntitySchema,
  EntitySchemaDocument
> {
  constructor(
    @InjectModel(EntitySchema.name)
    model: Model<EntitySchemaDocument>
  ) {
    super(model);
  }
}
