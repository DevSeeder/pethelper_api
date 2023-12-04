import { Inject, Injectable } from '@nestjs/common';
import { PetsRepository } from 'src/microservice/adapter/repository/pets.repository';
import { Pet, PetDocument } from '../../../../domain/schemas/pets.schema';
import { GetColorService } from '../colors/get-color.service';
import { GetAnimalService } from '../animals/get-animal.service';
import { GetRaceService } from '../races/get-race.service';
import { AbstractUpdateService } from '../../abstract/abstract-update.service';
import { PetResponse } from '../../../dto/response/pet.response';
import { PetBodyDto } from '../../../dto/body/pet-body.dto';
import { SearchPetDto } from '../../../dto/search/search-pet.dto';
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';

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
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(repository, 'Pet', ['pets'], fieldSchemaData);
  }
}
