import { Controller } from '@nestjs/common';
import { GetAnimalService } from 'src/microservice/application/service/animals/get-animal.service';
import { AbstractController } from './abstract.controller';
import { AnimalResponse } from 'src/microservice/application/dto/response/animal.response';
import {
  Animal,
  AnimalDocument
} from 'src/microservice/domain/schemas/animals.schema';
import { UpdateAnimalService } from 'src/microservice/application/service/animals/update-animal.service';
import { AnimalBodyDto } from 'src/microservice/application/dto/body/Animal-body.dto';
import { CreateAnimalService } from 'src/microservice/application/service/animals/create-animal.service';
import { SearchAnimalDto } from 'src/microservice/application/dto/search/search-animal.dto';
import { GetFieldSchemaService } from 'src/microservice/application/service/field-schemas/get-field-schemas.service';

@Controller('animals')
export class AnimalsController extends AbstractController<
  Animal,
  AnimalDocument,
  AnimalResponse,
  SearchAnimalDto,
  AnimalBodyDto
> {
  constructor(
    protected readonly getService: GetAnimalService,
    protected readonly updateService: UpdateAnimalService,
    protected readonly createService: CreateAnimalService,
    protected readonly getFieldSchemaService: GetFieldSchemaService
  ) {
    super(
      'Animal',
      'animals',
      'idGroup',
      [],
      getService,
      updateService,
      createService,
      getFieldSchemaService
    );
  }
}
