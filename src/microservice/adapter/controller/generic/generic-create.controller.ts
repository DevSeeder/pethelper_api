import { Controller, Inject } from '@nestjs/common';
import { FieldSchema } from 'src/microservice/domain/schemas/configuration-schemas/field-schemas.schema';
import { EntitySchema } from 'src/microservice/domain/schemas/configuration-schemas/entity-schemas.schema';
import { ErrorService } from 'src/microservice/application/service/configuration/error-schema/error.service';
import { GetTranslationService } from 'src/microservice/application/service/translation/get-translation.service';
import { DependecyTokens } from 'src/microservice/application/app.constants';
import { AbstractCreateController } from '../abstract/abstract-create.controller';
import { GenericCreateService } from 'src/microservice/application/service/abstract/generic-create.service';

export function GenericCreateController<
  Collection,
  GetResponse,
  SearchParams,
  BodyDto
>({ entity }: { entity: string }) {
  @Controller(entity.toLowerCase())
  class GenericCreateControllerHost extends AbstractCreateController<
    Collection,
    GetResponse,
    SearchParams,
    BodyDto
  > {
    constructor(
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
        createService,
        fieldSchemaData,
        entitySchemaData,
        errorService,
        translationService
      );
    }
  }

  Object.defineProperty(GenericCreateControllerHost, 'name', {
    value: `${entity.capitalizeFirstLetter()}CreateController`
  });

  return GenericCreateControllerHost;
}
