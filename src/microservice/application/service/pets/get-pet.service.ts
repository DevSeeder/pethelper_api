import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { AbstractGetService } from '../abstract/abstract-get.service';
import { PetsRepository } from 'src/microservice/adapter/repository/pets.repository';
import { Pet, PetDocument } from '../../../domain/schemas/pets.schema';
import { GetColorService } from '../colors/get-color.service';
import { GetAnimalService } from '../animals/get-animal.service';
import { GetRaceService } from '../races/get-race.service';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { GetUserService } from '../users/get-user.service';
import { GetFieldSchemaService } from '../field-schemas/get-field-schemas.service';

@Injectable()
export class GetPetService extends AbstractGetService<
  Pet,
  PetDocument,
  PetResponse,
  SearchPetDto
> {
  constructor(
    protected readonly repository: PetsRepository,
    protected readonly colorsService: GetColorService,
    protected readonly animalsService: GetAnimalService,
    protected readonly racesService: GetRaceService,
    protected readonly usersService: GetUserService,
    @Inject(forwardRef(() => GetFieldSchemaService))
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(repository, 'Pet', ['pets'], getFieldSchemaService);
  }
}
