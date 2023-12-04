import { Inject, Injectable } from '@nestjs/common';
import { AnimalsRepository } from 'src/microservice/adapter/repository/animals.repository';
import {
  Animal,
  AnimalDocument
} from '../../../../domain/schemas/animals.schema';
import { AnimalResponse } from '../../../dto/response/animal.response';
import { AnimalBodyDto } from '../../../dto/body/animal-body.dto';
import { GetAnimalGroupService } from '../animal-groups/get-animal-group.service';
import { AbstractCreateService } from '../../abstract/abstract-create.service';
import { GetFieldSchemaService } from '../../configuration/field-schemas/get-field-schemas.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { FieldSchema } from 'src/microservice/domain/schemas/field-schemas.schema';

@Injectable()
export class CreateAnimalService extends AbstractCreateService<
  Animal,
  AnimalDocument,
  AnimalResponse,
  AnimalBodyDto
> {
  constructor(
    protected readonly repository: AnimalsRepository,
    protected readonly getAnimalGroupsService: GetAnimalGroupService,
    protected readonly getFieldSchemaService: GetFieldSchemaService,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData?: FieldSchema[]
  ) {
    super(
      repository,
      'Animal',
      ['animals', 'config'],
      getFieldSchemaService,
      fieldSchemaData
    );
  }
}
