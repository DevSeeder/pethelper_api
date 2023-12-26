import { Inject, Injectable } from '@nestjs/common';
import { AbstractGetService } from '../../abstract/abstract-get.service';
import {
  Color,
  ColorDocument
} from '../../../../domain/schemas/entity/colors.schema';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { GetTranslationService } from '../../translation/get-translation.service';
import { ErrorService } from '../../configuration/error-schema/error.service';
import { GenericRepository } from 'src/microservice/adapter/repository/generic.repository';

@Injectable()
export class GetColorService extends AbstractGetService<
  Color,
  ColorDocument,
  Color,
  any
> {
  constructor(
    @Inject(`GENERIC_REPOSITORY_${Color.name}`)
    protected readonly repository: GenericRepository<Color>,
    @Inject(DependecyTokens.FIELD_SCHEMA_DB)
    protected readonly fieldSchemaData: FieldSchema[],
    @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
    protected readonly entitySchemaData: EntitySchema[],
    protected readonly translationService?: GetTranslationService,
    protected readonly errorService?: ErrorService
  ) {
    super(
      repository,
      'colors',
      fieldSchemaData,
      entitySchemaData,
      translationService,
      errorService
    );
  }
}
