import { Controller, Inject } from '@nestjs/common';
import { GetAnimalService } from 'src/microservice/application/service/entity/animals/get-animal.service';
import { AbstractController } from './abstract.controller';
import { AnimalResponse } from 'src/microservice/application/dto/response/animal.response';
import {
  Animal,
  AnimalDocument
} from 'src/microservice/domain/schemas/animals.schema';
import { UpdateAnimalService } from 'src/microservice/application/service/entity/animals/update-animal.service';
import { AnimalBodyDto } from 'src/microservice/application/dto/body/Animal-body.dto';
import { CreateAnimalService } from 'src/microservice/application/service/entity/animals/create-animal.service';
import { SearchAnimalDto } from 'src/microservice/application/dto/search/search-animal.dto';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';

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
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      'Animal',
      ['animals', 'config'],
      'idGroup',
      [],
      getService,
      updateService,
      createService,
      fieldSchemaData
    );
  }
}
