import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import {
  FieldSchema,
  FieldSchemaDocument
} from '../../../domain/schemas/field-schemas.schema';
import { FieldSchemasRepository } from 'src/microservice/adapter/repository/field-schemas.repository';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { FieldItemSchema } from 'src/microservice/domain/interface/field-schema.interface';

@Injectable()
export class GetFieldSchemaService extends AbstractGetService<
  FieldSchema,
  FieldSchemaDocument,
  FieldItemSchema,
  any
> {
  constructor(protected readonly repository: FieldSchemasRepository) {
    super(repository);
  }
}
