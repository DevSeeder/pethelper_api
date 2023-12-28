import { Controller, Inject } from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { AbstractController } from './abstract.controller';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import {
  Pet,
  PetDocument
} from 'src/microservice/domain/schemas/entity/pets.schema';
import { PetBodyDto } from 'src/microservice/application/dto/body/pet-body.dto';
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

@Controller('pets')
export class PetsController extends AbstractController<
  Pet,
  PetResponse,
  SearchPetDto,
  PetBodyDto
> {
  constructor(
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.PET}`)
    readonly getService: GenericGetService<Pet, PetResponse, SearchPetDto>,
    @Inject(`GENERIC_UPDATE_SERVICE_${DependencyEntityTokens.PET}`)
    readonly updateService: GenericUpdateService<
      Pet,
      PetResponse,
      PetBodyDto,
      SearchPetDto
    >,
    @Inject(`GENERIC_CREATE_SERVICE_${DependencyEntityTokens.PET}`)
    readonly createService: GenericCreateService<
      Pet,
      PetResponse,
      SearchPetDto
    >,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    readonly entitySchemaData?: EntitySchema[],
    readonly errorService?: ErrorService,
    readonly translationService?: GetTranslationService
  ) {
    super(
      'pets',
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
