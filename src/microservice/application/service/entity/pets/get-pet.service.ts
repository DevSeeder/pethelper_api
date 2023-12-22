import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import {
  Pet,
  PetDocument
} from '../../../../domain/schemas/entity/pets.schema';
import { GetColorService } from '../colors/get-color.service';
import { GetAnimalService } from '../animals/get-animal.service';
import { GetRaceService } from '../races/get-race.service';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { GetUserService } from '../users/get-user.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';

@Injectable()
export class GetPetService extends AbstractGetService<
  Pet,
  PetDocument,
  PetResponse,
  SearchPetDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    protected readonly getColorsService: GetColorService,
    protected readonly getAnimalsService: GetAnimalService,
    protected readonly getUsersService: GetUserService,
    protected readonly getRacesService: GetRaceService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[] = [],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(
      repository,
      'pets',
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
