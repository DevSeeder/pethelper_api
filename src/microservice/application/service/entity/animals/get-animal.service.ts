import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalDocument
} from '../../../../domain/schemas/entity/animals.schema';
import { AnimalResponse } from '../../../dto/response/animal.response';
import { SearchAnimalDto } from '../../../dto/search/search-animal.dto';
import { GetAnimalGroupService } from '../animal-groups/get-animal-group.service';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

@Injectable()
export class GetAnimalService extends AbstractGetService<
  Animal,
  AnimalDocument,
  AnimalResponse,
  SearchAnimalDto
> {
  constructor(
    protected readonly repository: AnimalsRepository,
    protected readonly getAnimalGroupsService: GetAnimalGroupService,
    protected readonly getFieldSchemaService: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      repository,
      'Animal',
      ['animals', 'config'],
      getFieldSchemaService,
      fieldSchemaData
    );
  }
}
