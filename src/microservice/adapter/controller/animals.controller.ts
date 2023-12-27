import { Controller, Inject } from '@nestjs/common';
import { AbstractController } from './abstract.controller';
import { AnimalResponse } from 'src/microservice/application/dto/response/animal.response';
import {
  Animal,
  AnimalDocument
} from 'src/microservice/domain/schemas/entity/animals.schema';
import { AnimalBodyDto } from 'src/microservice/application/dto/body/Animal-body.dto';
import { SearchAnimalDto } from 'src/microservice/application/dto/search/search-animal.dto';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { GenericGetService } from 'src/microservice/application/service/abstract/generic-get.service';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';
import { GenericCreateService } from 'src/microservice/application/service/abstract/generic-create.service';

@Controller('animals')
export class AnimalsController extends AbstractController<
  Animal,
  AnimalDocument,
  AnimalResponse,
  SearchAnimalDto,
  AnimalBodyDto
> {
  constructor(
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.ANIMAL}`)
    protected readonly getService: GenericGetService<
      Animal,
      AnimalResponse,
      SearchAnimalDto
    >,
    @Inject(`GENERIC_UPDATE_SERVICE_${DependencyEntityTokens.ANIMAL}`)
    protected readonly updateService: GenericUpdateService<
      Animal,
      AnimalResponse,
      AnimalBodyDto,
      SearchAnimalDto
    >,
    @Inject(`GENERIC_CREATE_SERVICE_${DependencyEntityTokens.ANIMAL}`)
    protected readonly createService: GenericCreateService<
      Animal,
      AnimalResponse,
      AnimalBodyDto
    >,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[],
    protected readonly errorService?: ErrorService,
    protected readonly translationService?: GetTranslationService
  ) {
    super(
      'animals',
      getService,
      updateService,
      createService,
      fieldSchemaData,
      entitySchemaData,
      errorService,
      translationService
    );
  }
}
