import { Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/pets.repository';
import {
  Pet,
  PetDocument,
  PetRelations
} from '../../../domain/schemas/pets.schema';
import { GetColorService } from '../colors/get-color.service';
import { GetAnimalService } from '../animals/get-animal.service';
import { GetRaceService } from '../races/get-race.service';
import { PetResponse } from '../../dto/response/pet.response';
import { AbstractCreateService } from '../abstract/abstract-create.service';
import { PetBodyDto } from '../../dto/body/pet-body.dto';
import { GetUserService } from '../users/get-user.service';

@Injectable()
export class CreatePetService extends AbstractCreateService<
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
    protected readonly usersService: GetUserService
  ) {
    super(repository, 'Pet', PetRelations);
  }
}
