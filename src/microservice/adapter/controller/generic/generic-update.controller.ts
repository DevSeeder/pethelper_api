import { Controller, Inject } from '@nestjs/common';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { AbstractUpdateController } from '../abstract/abstract-update.controller';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';

export function GenericUpdateController<
  Collection,
  GetResponse,
  SearchParams,
  BodyDto
>({ entity }: { entity: string }) {
  @Controller(entity.toLowerCase())
  class GenericUpdateControllerHost extends AbstractUpdateController<
    Collection,
    GetResponse,
    SearchParams,
    BodyDto
  > {
    constructor(
      @Inject(`GENERIC_UPDATE_SERVICE_${entity}`)
      readonly updateService?: GenericUpdateService<
        Collection,
        GetResponse,
        BodyDto,
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
        updateService,
        fieldSchemaData,
        entitySchemaData,
        errorService,
        translationService
      );
    }
  }

  Object.defineProperty(GenericUpdateControllerHost, 'name', {
    value: `${entity.capitalizeFirstLetter()}UpdateController`
  });

  return GenericUpdateControllerHost;
}
