import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  AnimalGroup,
  AnimalGroupDocument
} from '../../../../domain/schemas/animal-group.schema';
import { AnimalGroupsRepository } from 'src/microservice/adapter/repository/animal-groups.repository';
import { SearchConfigDto } from '../../../dto/search/search-config.dto';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';

@Injectable()
export class GetAnimalGroupService extends AbstractGetService<
  AnimalGroup,
  AnimalGroupDocument,
  AnimalGroup,
  SearchConfigDto
> {
  constructor(
    protected readonly repository: AnimalGroupsRepository,
    protected readonly getFieldSchemaService: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      repository,
      'Animal Group',
      ['animalGroups', 'config'],
      getFieldSchemaService,
      fieldSchemaData
    );
  }
}
