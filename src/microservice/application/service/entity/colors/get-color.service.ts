import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  Color,
  ColorDocument
} from '../../../../domain/schemas/entity/colors.schema';
import { ColorsRepository } from 'src/microservice/adapter/repository/entity/colors.repository';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class GetColorService extends AbstractGetService<
  Color,
  ColorDocument,
  Color,
  any
> {
  constructor(
    protected readonly repository: ColorsRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, 'colors', fieldSchemaData, entitySchemaData);
  }
}
