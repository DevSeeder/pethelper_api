import { Inject, Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/pets.repository';
import {
  Pet,
  PetDocument
} from '../../../../domain/schemas/entity/pets.schema';
import { GetColorService } from '../colors/get-color.service';
import { GetAnimalService } from '../animals/get-animal.service';
import { GetRaceService } from '../races/get-race.service';
import { PetResponse } from '../../../dto/response/pet.response';
import { AbstractCreateService } from '../../abstract/abstract-create.service';
import { PetBodyDto } from '../../../dto/body/pet-body.dto';
import { GetUserService } from '../users/get-user.service';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { CreateExpenseService } from '../expenses/create-expense.service';
import { GetExpenseService } from '../expenses/get-Expense.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

@Injectable()
export class CreatePetService extends AbstractCreateService<
  Pet,
  PetDocument,
  PetResponse,
  PetBodyDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    protected readonly getColorsService: GetColorService,
    protected readonly getAnimalsService: GetAnimalService,
    protected readonly getRacesService: GetRaceService,
    protected readonly getUsersService: GetUserService,
    protected readonly getExpensesService: GetExpenseService,
    protected readonly createExpensesService: CreateExpenseService,
    protected readonly getFieldSchemaService: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(repository, 'Pet', ['pets'], getFieldSchemaService, fieldSchemaData);
  }
}
