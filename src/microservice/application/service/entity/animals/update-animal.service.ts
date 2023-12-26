import { Inject, Injectable } from '@nestjs/common';
import { AnimalsRepository } from 'src/microservice/adapter/repository/entity/animals.repository';
import {
  Animal,
  AnimalDocument
} from '../../../../domain/schemas/entity/animals.schema';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import { AnimalResponse } from '../../../dto/response/animal.response';
import { AnimalBodyDto } from '../../../dto/body/animal-body.dto';
import { SearchAnimalDto } from '../../../dto/search/search-animal.dto';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { GenericGetService } from '../../abstract/generic-get.service';
import { AnimalGroup } from 'src/microservice/domain/schemas/entity/animal-group.schema';
import { Search } from 'src/microservice/application/dto/search/search.dto';

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
    @Inject(`GENERIC_GET_SERVICE_${AnimalGroup.name}`)
    protected readonly getAnimalGroupsService: GenericGetService<
      AnimalGroup,
      AnimalGroup,
      Search
    >,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(
      repository,
      'animals',
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
