import { Inject, Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import { Pet } from '../../../../domain/schemas/entity/pets.schema';
import { GenericUpdateService } from '../../abstract/generic-update.service';
import { PetResponse } from '../../../dto/response/pet.response';
import { PetBodyDto } from '../../../dto/body/pet-body.dto';
import { SearchPetDto } from '../../../dto/search/search-pet.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import {
  DependecyTokens,
  DependencyEntityTokens
} from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { Color } from 'src/microservice/domain/schemas/entity/colors.schema';
import { GenericGetService } from '../../abstract/generic-get.service';
import { Race } from 'src/microservice/domain/schemas/entity/races.schema';
import { Search } from 'src/microservice/application/dto/search/search.dto';
import { SearchAnimalDto } from 'src/microservice/application/dto/search/search-animal.dto';
import { AnimalResponse } from 'src/microservice/application/dto/response/animal.response';
import { Animal } from 'src/microservice/domain/schemas/entity/animals.schema';
import { Expense } from 'src/microservice/domain/schemas/entity/expenses.schema';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-expense.dto';
import { ExpenseBodyDto } from 'src/microservice/application/dto/body/expense-body.dto';
import { GetExpenseService } from '../expenses/get-expense.service';

@Injectable()
export class UpdatePetService extends GenericUpdateService<
  Pet,
  PetResponse,
  PetBodyDto,
  SearchPetDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.COLOR}`)
    protected readonly getColorsService: GenericGetService<
      Color,
      Color,
      Search
    >,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.ANIMAL}`)
    protected readonly getAnimalsService: GenericGetService<
      Animal,
      AnimalResponse,
      SearchAnimalDto
    >,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.RACE}`)
    protected readonly getRacesService: GenericGetService<Race, Race, Search>,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    protected readonly getExpensesService: GetExpenseService,
    @Inject(`GENERIC_UPDATE_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    protected readonly updateExpensesService: GenericUpdateService<
      Expense,
      ExpenseResponse,
      ExpenseBodyDto,
      SearchExpenseDto
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
      'pets',
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
