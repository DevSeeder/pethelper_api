import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { SearchDomainDto } from '../../../dto/search/search-domain.dto';
import {
  AnimalType,
  AnimalTypeDocument
} from 'src/microservice/domain/schemas/entity/animal-type.schema';
import { AnimalTypesRepository } from 'src/microservice/adapter/repository/entity/animal-types.repository';

@Injectable()
export class GetAnimalTypeService extends AbstractGetService<
  AnimalType,
  AnimalTypeDocument,
  AnimalType,
  SearchDomainDto
> {
  constructor(protected readonly repository: AnimalTypesRepository) {
    super(repository, 'animalTypes');
  }
}
