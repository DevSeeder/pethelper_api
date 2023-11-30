import { Injectable } from '@nestjs/common';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalDocument
} from '../../../../domain/schemas/animals.schema';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import { AnimalResponse } from '../../../dto/response/animal.response';
import { AnimalBodyDto } from '../../../dto/body/animal-body.dto';
import { GetAnimalGroupService } from '../animal-groups/get-animal-group.service';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { SearchAnimalDto } from '../../../dto/search/search-animal.dto';

@Injectable()
export class UpdateAnimalService extends AbstractUpdateService<
  Animal,
  AnimalDocument,
  AnimalResponse,
  AnimalBodyDto,
  SearchAnimalDto
> {
  constructor(
    protected readonly repository: AnimalsRepository,
    protected readonly getAnimalGroupsService: GetAnimalGroupService,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Animal', ['animals', 'config'], getFieldSchemaService);
  }
}
