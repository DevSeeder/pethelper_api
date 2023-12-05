import { Inject, Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/entity/pets.repository';
import {
  Pet,
  PetDocument
} from '../../../../domain/schemas/entity/pets.schema';
import { GetColorService } from '../colors/get-color.service';
import { GetAnimalService } from '../animals/get-animal.service';
import { GetRaceService } from '../races/get-race.service';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import { PetResponse } from '../../../dto/response/pet.response';
import { PetBodyDto } from '../../../dto/body/pet-body.dto';
import { SearchPetDto } from '../../../dto/search/search-pet.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { UpdateExpenseService } from '../expenses/update-expense.service';
import { GetExpenseService } from '../expenses/get-Expense.service';

@Injectable()
export class UpdatePetService extends AbstractUpdateService<
  Pet,
  PetDocument,
  PetResponse,
  PetBodyDto,
  SearchPetDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    protected readonly getColorsService: GetColorService,
    protected readonly getAnimalsService: GetAnimalService,
    protected readonly getRacesService: GetRaceService,
    protected readonly getExpensesService: GetExpenseService,
    protected readonly updateExpensesService: UpdateExpenseService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(repository, 'pets', fieldSchemaData, entitySchemaData);
  }
}
