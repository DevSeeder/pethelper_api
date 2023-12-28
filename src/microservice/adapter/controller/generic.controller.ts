import { Controller, Inject } from '@nestjs/common';
import { AbstractController } from './abstract.controller';
import { GenericGetService } from 'src/microservice/application/service/abstract/generic-get.service';
import { GenericUpdateService } from 'src/microservice/application/service/abstract/generic-update.service';
import { GenericCreateService } from 'src/microservice/application/service/abstract/generic-create.service';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';

export function GenericController<
  Collection,
  GetResponse,
  SearchParams,
  BodyDto
>({ entity }: { entity: string }) {
  @Controller(entity.toLowerCase())
  class GenericControllerHost extends AbstractController<
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
      @Inject(`GENERIC_UPDATE_SERVICE_${entity}`)
      readonly updateService?: GenericUpdateService<
        Collection,
        GetResponse,
        BodyDto,
        SearchParams
      >,
      @Inject(`GENERIC_CREATE_SERVICE_${entity}`)
      readonly createService?: GenericCreateService<
        Collection,
        GetResponse,
        BodyDto
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
        updateService,
        createService,
        fieldSchemaData,
        entitySchemaData,
        errorService,
        translationService
      );
    }
  }

  Object.defineProperty(GenericControllerHost, 'name', {
    value: `${entity.capitalizeFirstLetter()}Controller`
  });

  return GenericControllerHost;
}
