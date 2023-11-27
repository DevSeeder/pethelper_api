import { Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/pets.repository';
import { Pet, PetDocument } from '../../../domain/schemas/pets.schema';
import { GetColorService } from '../colors/get-color.service';
import { GetAnimalService } from '../animals/get-animal.service';
import { GetRaceService } from '../races/get-race.service';
import { AbstractUpdateService } from '../abstract/abstract-update.service';
import { PetResponse } from '../../dto/response/pet.response';
import { PetBodyDto } from '../../dto/body/pet-body.dto';
import { PetFieldSchema } from 'src/microservice/adapter/field-schemas/pet-field.schema';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';

@Injectable()
export class UpdatePetService extends AbstractUpdateService<
  Pet,
  PetDocument,
  PetResponse,
  PetBodyDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    protected readonly colorsService: GetColorService,
    protected readonly animalsService: GetAnimalService,
    protected readonly racesService: GetRaceService,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Pet', ['pets'], getFieldSchemaService);
  }
}
