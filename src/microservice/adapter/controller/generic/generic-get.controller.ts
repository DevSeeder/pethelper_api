import { Controller, Inject } from '@nestjs/common';
import { GenericGetService } from 'src/microservice/application/service/abstract/generic-get.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { AbstractGetController } from '../abstract/abstract-get.controller';

export function GenericGetController<
  Collection,
  GetResponse,
  SearchParams,
  BodyDto
>({ entity }: { entity: string }) {
  @Controller(entity.toLowerCase())
  class GenericGetControllerHost extends AbstractGetController<
    Collection,
    GetResponse,
    SearchParams,
    BodyDto
  > {
    constructor(
      @Inject(`GENERIC_GET_SERVICE_${entity}`)
      readonly getService?: GenericGetService<
        Collection,
        GetResponse,
        SearchParams
      >,
      @Inject(DependecyTokens.FIELD_SCHEMA_DB)
      readonly fieldSchemaData?: FieldSchema[],
      @Inject(DependecyTokens.ENTITY_SCHEMA_DB)
      readonly entitySchemaData?: EntitySchema[],
      readonly errorService?: ErrorService,
      readonly translationService?: GetTranslationService
    ) {
      super(
        entity,
        getService,
        fieldSchemaData,
        entitySchemaData,
        errorService,
        translationService
      );
    }
  }

  Object.defineProperty(GenericGetControllerHost, 'name', {
    value: `${entity.capitalizeFirstLetter()}GetController`
  });

  return GenericGetControllerHost;
}
