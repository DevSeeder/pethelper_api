import { Injectable, Inject } from '@nestjs/common';
import { GenericGetService } from '../../abstract/generic-get.service';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import { Pet } from '../../../../domain/schemas/entity/pets.schema';
import { GetAnimalService } from '../animals/get-animal.service';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import { GetUserService } from '../users/get-user.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { GetExpenseService } from '../expenses/get-Expense.service';
import { Color } from 'src/microservice/domain/schemas/entity/colors.schema';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { Race } from 'src/microservice/domain/schemas/entity/races.schema';

@Injectable()
export class GetPetService extends GenericGetService<
  Pet,
  PetResponse,
  SearchPetDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    @Inject(`GENERIC_GET_SERVICE_${Color.name}`)
    protected readonly getColorsService: GenericGetService<
      Color,
      Color,
      Search
    >,
    protected readonly getAnimalsService: GetAnimalService,
    protected readonly getUsersService: GetUserService,
    @Inject(`GENERIC_GET_SERVICE_${Race.name}`)
    protected readonly getRacesService: GenericGetService<Race, Race, Search>,
    protected readonly getExpensesService: GetExpenseService,
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
