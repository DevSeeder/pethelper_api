import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  Race,
  RaceDocument
} from '../../../../domain/schemas/entity/races.schema';
import { RacesRepository } from 'src/microservice/adapter/repository/entity/races.repository';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class GetRaceService extends AbstractGetService<
  Race,
  RaceDocument,
  Race,
  Search
> {
  constructor(
    protected readonly repository: RacesRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, 'races', fieldSchemaData, entitySchemaData);
  }
}
