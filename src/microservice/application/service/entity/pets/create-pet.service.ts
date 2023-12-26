import { Inject, Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import {
  Pet,
  PetDocument
} from '../../../../domain/schemas/entity/pets.schema';
import { GetAnimalService } from '../animals/get-animal.service';
import { PetResponse } from '../../../dto/response/pet.response';
import { AbstractCreateService } from '../../abstract/abstract-create.service';
import { PetBodyDto } from '../../../dto/body/pet-body.dto';
import { GetUserService } from '../users/get-user.service';
import { CreateExpenseService } from '../expenses/create-expense.service';
import { GetExpenseService } from '../expenses/get-Expense.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { GenericGetService } from '../../abstract/generic-get.service';
import { Color } from 'src/microservice/domain/schemas/entity/colors.schema';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { Race } from 'src/microservice/domain/schemas/entity/races.schema';

@Injectable()
export class CreatePetService extends AbstractCreateService<
  Pet,
  PetDocument,
  PetResponse,
  PetBodyDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.COLOR}`)
    protected readonly getColorsService: GenericGetService<
      Color,
      Color,
      Search
    >,
    protected readonly getAnimalsService: GetAnimalService,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.RACE}`)
    protected readonly getRacesService: GenericGetService<Race, Race, Search>,
    protected readonly getUsersService: GetUserService,
    protected readonly getExpensesService: GetExpenseService,
    protected readonly createExpensesService: CreateExpenseService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
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
