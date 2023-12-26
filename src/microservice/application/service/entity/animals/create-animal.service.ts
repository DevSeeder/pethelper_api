import { Inject, Injectable } from '@nestjs/common';
import { AnimalsRepository } from 'src/microservice/adapter/repository/entity/animals.repository';
import {
  Animal,
  AnimalDocument
} from '../../../../domain/schemas/entity/animals.schema';
import { AnimalResponse } from '../../../dto/response/animal.response';
import { AnimalBodyDto } from '../../../dto/body/animal-body.dto';
import { AbstractCreateService } from '../../abstract/abstract-create.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { UpdateAnimalService } from './update-animal.service';
import { AnimalGroup } from 'src/microservice/domain/schemas/entity/animal-group.schema';
import { GenericGetService } from '../../abstract/generic-get.service';
import { Search } from 'src/microservice/application/dto/search/search.dto';

@Injectable()
export class CreateAnimalService extends AbstractCreateService<
  Animal,
  AnimalDocument,
  AnimalResponse,
  AnimalBodyDto
> {
  constructor(
    protected readonly repository: AnimalsRepository,
    protected readonly updateService: UpdateAnimalService,
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
      updateService,
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
