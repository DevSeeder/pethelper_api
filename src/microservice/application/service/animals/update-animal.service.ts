import { Injectable } from '@nestjs/common';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalDocument,
  AnimalRelations
} from '../../../domain/schemas/animals.schema';
import { AbstractUpdateService } from '../abstract/abstract-update.service';
import { AnimalResponse } from '../../dto/response/animal.response';
import { AnimalBodyDto } from '../../dto/body/animal-body.dto';
import { GetAnimalGroupService } from '../animal-groups/get-animal-group.service';

@Injectable()
export class UpdateAnimalService extends AbstractUpdateService<
  Animal,
  AnimalDocument,
  AnimalResponse,
  AnimalBodyDto
> {
  constructor(
    protected readonly repository: AnimalsRepository,
    protected readonly animalGroupsService: GetAnimalGroupService
  ) {
    super(repository, 'Animal', AnimalRelations);
  }
}
