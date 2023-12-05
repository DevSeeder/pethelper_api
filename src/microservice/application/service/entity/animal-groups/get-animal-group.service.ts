import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  AnimalGroup,
  AnimalGroupDocument
} from '../../../../domain/schemas/entity/animal-group.schema';
import { AnimalGroupsRepository } from 'src/microservice/adapter/repository/entity/animal-groups.repository';
import { SearchDomainDto } from '../../../dto/search/search-domain.dto';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

@Injectable()
export class GetAnimalGroupService extends AbstractGetService<
  AnimalGroup,
  AnimalGroupDocument,
  AnimalGroup,
  SearchDomainDto
> {
  constructor(
    protected readonly repository: AnimalGroupsRepository,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, 'animalGroups', fieldSchemaData, entitySchemaData);
  }
}
