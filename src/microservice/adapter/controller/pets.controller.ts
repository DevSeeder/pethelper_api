import { Controller } from '@nestjs/common';
import { SearchPetDto } from 'src/microservice/application/dto/search/search-pet.dto';
import { GetPetService } from 'src/microservice/application/service/pets/get-pet.service';
import { AbstractController } from './abstract.controller';
import { PetResponse } from 'src/microservice/application/dto/response/pet.response';
import { Pet, PetDocument } from 'src/microservice/domain/schemas/pets.schema';
import { PetTransformation } from 'src/microservice/application/transform/pet.transformation';
import { PetInputSchema } from '../schemas/pet-input.schema';

@Controller('pets')
export class PetsController extends AbstractController<
  Pet,
  PetDocument,
  PetResponse,
  SearchPetDto
> {
  constructor(protected readonly getService: GetPetService) {
    super(getService, 'userId', new PetTransformation(), PetInputSchema);
  }
}
