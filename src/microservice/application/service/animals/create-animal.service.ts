import { Injectable } from '@nestjs/common';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import { Animal, AnimalDocument } from '../../../domain/schemas/animals.schema';
import { AnimalResponse } from '../../dto/response/animal.response';
import { AnimalBodyDto } from '../../dto/body/animal-body.dto';
import { GetAnimalGroupService } from '../animal-groups/get-animal-group.service';
import { AbstractCreateService } from '../abstract/abstract-create.service';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';

@Injectable()
export class CreateAnimalService extends AbstractCreateService<
  Animal,
  AnimalDocument,
  AnimalResponse,
  AnimalBodyDto
> {
  constructor(
    protected readonly repository: AnimalsRepository,
    protected readonly animalGroupsService: GetAnimalGroupService,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Animal', ['animals', 'config'], getFieldSchemaService);
  }
}
