import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { Race, RaceDocument } from '../../../domain/schemas/races.schema';
import { RacesRepository } from 'src/microservice/adapter/repository/races.repository';
import { Search } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class GetRaceService extends AbstractGetService<
  Race,
  RaceDocument,
  Race,
  Search
> {
  constructor(protected readonly repository: RacesRepository) {
    super(repository);
  }
}
