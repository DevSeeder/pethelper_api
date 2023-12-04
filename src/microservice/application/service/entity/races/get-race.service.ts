import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  Race,
  RaceDocument
} from '../../../../domain/schemas/entity/races.schema';
import { RacesRepository } from 'src/microservice/adapter/repository/races.repository';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';

@Injectable()
export class GetRaceService extends AbstractGetService<
  Race,
  RaceDocument,
  Race,
  Search
> {
  constructor(
    protected readonly repository: RacesRepository,
    protected readonly getFieldSchemaService: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      repository,
      'Race',
      ['races', 'config'],
      getFieldSchemaService,
      fieldSchemaData
    );
  }
}
