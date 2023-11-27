import { Injectable } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalDocument,
  AnimalRelations
} from '../../../domain/schemas/animals.schema';
import { AnimalResponse } from '../../dto/response/animal.response';
import { SearchAnimalDto } from '../../dto/search/search-animal.dto';
import { GetAnimalGroupService } from '../animal-groups/get-animal-group.service';
import { AnimalFieldSchema } from 'src/microservice/adapter/schemas/animal-field.schema';

@Injectable()
export class GetAnimalService extends AbstractGetService<
  Animal,
  AnimalDocument,
  AnimalResponse,
  SearchAnimalDto
> {
  constructor(
    protected readonly repository: AnimalsRepository,
    protected readonly animalGroupsService: GetAnimalGroupService
  ) {
    super(repository, 'Animal', AnimalRelations, AnimalFieldSchema);
  }
}
