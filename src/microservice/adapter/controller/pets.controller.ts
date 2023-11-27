import { Controller } from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { GetPetService } from 'src/microservice/application/service/pets/get-pet.service';
import { AbstractController } from './abstract.controller';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import { Pet, PetDocument } from 'src/microservice/domain/schemas/pets.schema';
import { UpdatePetService } from 'src/microservice/application/service/pets/update-pet.service';
import { PetBodyDto } from 'src/microservice/application/dto/body/pet-body.dto';
import { CreatePetService } from 'src/microservice/application/service/pets/create-pet.service';
import { GetFieldSchemaService } from 'src/microservice/application/service/field-schemas/get-field-schemas.service';

@Controller('pets')
export class PetsController extends AbstractController<
  Pet,
  PetDocument,
  PetResponse,
  SearchPetDto,
  PetBodyDto
> {
  constructor(
    protected readonly getService: GetPetService,
    protected readonly updateService: UpdatePetService,
    protected readonly createService: CreatePetService,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(
      'Pet',
      'pets',
      'userId',
      [],
      getService,
      updateService,
      createService,
      getFieldSchemaService
    );
  }
}
