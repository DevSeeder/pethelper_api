import { Controller, Inject } from '@nestjs/common';
import { GetAnimalService } from 'src/microservice/application/service/entity/animals/get-animal.service';
import { AbstractController } from './abstract.controller';
import { AnimalResponse } from 'src/microservice/application/dto/response/animal.response';
import {
  Animal,
  AnimalDocument
} from 'src/microservice/domain/schemas/entity/animals.schema';
import { UpdateAnimalService } from 'src/microservice/application/service/entity/animals/update-animal.service';
import { AnimalBodyDto } from 'src/microservice/application/dto/body/Animal-body.dto';
import { CreateAnimalService } from 'src/microservice/application/service/entity/animals/create-animal.service';
import { SearchAnimalDto } from 'src/microservice/application/dto/search/search-animal.dto';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';

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
    protected readonly fieldSchemaData?: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData?: EntitySchema[]
  ) {
    super(
      'animals',
      getService,
      updateService,
      createService,
      fieldSchemaData,
      entitySchemaData
    );
  }
}
