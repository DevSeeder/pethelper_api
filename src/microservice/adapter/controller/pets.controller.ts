import { Controller, Inject } from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { GetPetService } from 'src/microservice/application/service/entity/pets/get-pet.service';
import { AbstractController } from './abstract.controller';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import {
  Pet,
  PetDocument
} from 'src/microservice/domain/schemas/entity/pets.schema';
import { UpdatePetService } from 'src/microservice/application/service/entity/pets/update-pet.service';
import { PetBodyDto } from 'src/microservice/application/dto/body/pet-body.dto';
import { CreatePetService } from 'src/microservice/application/service/entity/pets/create-pet.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';

@Controller('pets')
export class PetsController extends AbstractController<
  Pet,
  PetDocument,
  PetResponse,
  SearchPetDto,
  PetBodyDto
> {
  constructor(
    protected readonly getService: GetPetService,
    protected readonly updateService: UpdatePetService,
    protected readonly createService: CreatePetService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[],
    protected readonly errorService?: ErrorService
  ) {
    super(
      'pets',
      getService,
      updateService,
      createService,
      fieldSchemaData,
      entitySchemaData,
      errorService
    );
  }
}
