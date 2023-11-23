import { Controller } from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { GetPetService } from 'src/microservice/application/service/pets/get-pet.service';
import { AbstractController } from './abstract.controller';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import { Pet, PetDocument } from 'src/microservice/domain/schemas/pets.schema';
import { PetTransformation } from 'src/microservice/application/transform/pet.transformation';
import { PetInputSchema } from '../schemas/pet-input.schema';
import { UpdatePetService } from 'src/microservice/application/service/pets/update-pet.service';
import { PetBodyDto } from 'src/microservice/application/dto/body/pet-body.dto';
import { CreatePetService } from 'src/microservice/application/service/pets/create-pet.service';

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
    protected readonly createService: CreatePetService
  ) {
    super(
      getService,
      'userId',
      new PetTransformation(),
      PetInputSchema,
      'Pet',
      updateService
    );
  }
}
