import { Inject, Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import { Pet } from '../../../../domain/schemas/entity/pets.schema';
import { PetResponse } from '../../../dto/response/pet.response';
import { GenericCreateService } from '../../abstract/generic-create.service';
import { PetBodyDto } from '../../../dto/body/pet-body.dto';
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
import { User } from 'src/microservice/domain/schemas/entity/users.schema';
import { Animal } from 'src/microservice/domain/schemas/entity/animals.schema';
import { AnimalResponse } from 'src/microservice/application/dto/response/animal.response';
import { SearchAnimalDto } from 'src/microservice/application/dto/search/search-animal.dto';
import { Expense } from 'src/microservice/domain/schemas/entity/expenses.schema';
import { ExpenseResponse } from 'src/microservice/application/dto/response/expense.response';
import { ExpenseBodyDto } from 'src/microservice/application/dto/body/expense-body.dto';
import { SearchExpenseDto } from 'src/microservice/application/dto/search/search-expense.dto';
import { GetExpenseService } from '../expenses/get-expense.service';

@Injectable()
export class CreatePetService extends GenericCreateService<
  Pet,
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
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.ANIMAL}`)
    protected readonly getAnimalsService: GenericGetService<
      Animal,
      AnimalResponse,
      SearchAnimalDto
    >,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.RACE}`)
    protected readonly getRacesService: GenericGetService<Race, Race, Search>,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.USER}`)
    protected readonly getUsersService: GenericGetService<User, User, Search>,
    @Inject(`GENERIC_GET_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    protected readonly getExpensesService: GetExpenseService,
    @Inject(`GENERIC_CREATE_SERVICE_${DependencyEntityTokens.EXPENSE}`)
    protected readonly createExpensesService: GenericCreateService<
      Expense,
      ExpenseResponse,
      ExpenseBodyDto
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
