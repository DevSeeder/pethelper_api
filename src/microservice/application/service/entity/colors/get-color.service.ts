import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  Color,
  ColorDocument
} from '../../../../domain/schemas/entity/colors.schema';
import { ColorsRepository } from 'src/microservice/adapter/repository/colors.repository';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

@Injectable()
export class GetColorService extends AbstractGetService<
  Color,
  ColorDocument,
  Color,
  any
> {
  constructor(
    protected readonly repository: ColorsRepository,
    protected readonly getFieldSchemaService: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      repository,
      'Color',
      ['colors', 'config'],
      getFieldSchemaService,
      fieldSchemaData
    );
  }
}
