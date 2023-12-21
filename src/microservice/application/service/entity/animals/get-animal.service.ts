import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { AnimalsRepository } from 'src/microservice/adapter/repository/entity/animals.repository';
import {
  Animal,
  AnimalDocument
} from '../../../../domain/schemas/entity/animals.schema';
import { AnimalResponse } from '../../../dto/response/animal.response';
import { SearchAnimalDto } from '../../../dto/search/search-animal.dto';
import { GetAnimalGroupService } from '../animal-groups/get-animal-group.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';

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
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService
  ) {
    super(
      repository,
      'animals',
      fieldSchemaData,
      entitySchemaData,
      translationService
    );
  }
}
