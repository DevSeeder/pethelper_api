import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { Race, RaceDocument } from '../../../../domain/schemas/races.schema';
import { RacesRepository } from 'src/microservice/adapter/repository/races.repository';
import { Search } from '@devseeder/nestjs-microservices-commons';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';

@Injectable()
export class GetRaceService extends AbstractGetService<
  Race,
  RaceDocument,
  Race,
  Search
> {
  constructor(
    protected readonly repository: RacesRepository,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Race', ['races', 'config'], getFieldSchemaService);
  }
}
